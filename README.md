# kiln-compose-example

A small Docker Compose app used to test and document [Kiln](https://github.com/OthmanHaba/kiln)'s compose apps:

- `web`: nginx with a mounted config (`nginx/default.conf`), the public entry point
- `api`: a Node API built from `./app`, reading `app/defaults.env` and `${GREETING}`
- `worker`: a background job behind the `worker` profile
- `postgres` and `redis`: can stay in the stack or be replaced by Kiln-managed databases
- `compose.prod.yaml`: production overrides

Run locally: `docker compose up --build`, then open http://localhost:8080.
