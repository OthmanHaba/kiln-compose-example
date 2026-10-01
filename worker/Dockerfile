FROM redis:8-alpine
CMD ["sh", "-c", "while true; do redis-cli -u \"$REDIS_URL\" incr worker-ticks >/dev/null; sleep 30; done"]
