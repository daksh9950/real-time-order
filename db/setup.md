# MongoDB Setup

## Step 1 — Enable Replica Set (required for Change Streams)

Edit your `mongod.cfg`:
```yaml
replication:
  replSetName: "rs0"
```

Restart MongoDB, then run once:
```bash
mongosh
rs.initiate()
# Should return: { ok: 1 }
```

## Step 2 — Create Database
The database `realtime_orders` is created automatically when the server first connects.
