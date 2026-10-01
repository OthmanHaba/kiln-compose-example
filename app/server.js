// A tiny API: counts visits in Redis and stores notes in PostgreSQL.
import http from 'node:http';
import pg from 'pg';
import { createClient } from 'redis';

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: Number(process.env.POOL_SIZE ?? 5) });
const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();
await db.query('create table if not exists notes (id serial primary key, body text not null, created_at timestamptz default now())');

const json = (res, status, body) => {
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(body));
};

http.createServer(async (req, res) => {
    try {
        if (req.url === '/healthz') return json(res, 200, { ok: true });
        if (req.url === '/notes' && req.method === 'POST') {
            let body = '';
            for await (const chunk of req) body += chunk;
            const { rows } = await db.query('insert into notes (body) values ($1) returning *', [body || 'empty']);
            return json(res, 201, rows[0]);
        }
        if (req.url === '/notes') return json(res, 200, (await db.query('select * from notes order by id desc limit 20')).rows);
        const visits = await redis.incr('visits');
        return json(res, 200, { app: process.env.APP_NAME, greeting: process.env.GREETING ?? null, visits, pool: Number(process.env.POOL_SIZE) });
    } catch (error) {
        return json(res, 500, { error: String(error) });
    }
}).listen(3000, () => console.log('api listening on :3000'));
