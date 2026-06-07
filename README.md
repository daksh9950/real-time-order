# Real-Time Orders Notification System

A high-performance, production-ready system that broadcasts real-time updates to connected clients whenever order data changes in MongoDB (using MongoDB Change Streams)—completely eliminating the need for periodic polling.

---

## ⚡ Architecture Flow

```
MongoDB Change (Insert/Update/Delete) 
       │
       ▼
MongoDB Change Stream (Event Listener)
       │
       ▼
Redis Pub/Sub (Broker for Multi-Instance Scaling) ──► (Falls back to In-Memory Pub/Sub if offline)
       │
       ▼
Socket.io (Server-to-Client WebSocket Transport)
       │
       ▼
React Client (UI Instant Update)
```

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS | High-performance, responsive, and responsive user interface. |
| **Backend** | Node.js, Express | Fast, lightweight REST API & Socket.io server. |
| **Transport** | Socket.io | Bidirectional event-based communication with auto-fallback to HTTP long-polling. |
| **Message Broker**| Redis Pub/Sub | Cross-instance event propagation. Runs with **Automatic Local Fallback** if Redis is offline. |
| **Database** | MongoDB + Change Streams | Native real-time database listener (no trigger or polling overhead). |
| **Process Manager**| PM2 | Process monitoring, cluster mode, and zero-downtime reloads. |

---

## 📋 Prerequisites

- **Node.js** >= 18
- **MongoDB** >= 6.0 (configured as a **Replica Set**—required for Change Streams)
- **Redis** >= 7.0 (Optional for local development; fallback is automatic)

---

## 🚀 Setup & Installation

### Step 1: Initialize MongoDB Replica Set
MongoDB Change Streams require a replica set configuration. 

1. Edit your local MongoDB configuration file (`mongod.cfg` or `mongod.conf`) and append:
   ```yaml
   replication:
     replSetName: "rs0"
   ```
2. Restart your MongoDB service.
3. Open your terminal or MongoDB Shell (`mongosh`) and initiate the replica set:
   ```javascript
   rs.initiate()
   ```

---

### Step 2: Start Redis (Optional)
If you wish to test scaling/multi-instance setups, run Redis locally or configure a cloud provider:
* **WSL/Linux:** `sudo systemctl start redis-server`
* **MacOS:** `brew services start redis`
* **No Redis?** The system will automatically log a warning and fall back to an **In-Memory Pub/Sub** handler so you can continue developing without extra installation overhead.

---

### Step 3: Backend Configuration & Run
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Copy the sample environment file:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your Mongo URI or Redis credentials if needed.
4. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```

*You should see successful logs in the terminal confirming MongoDB connection, Redis status (or In-Memory fallback), and Change Stream initialization.*

---

### Step 4: Frontend Configuration & Run
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies and start the Vite dev server:
   ```bash
   npm install
   npm run dev
   ```
3. Open your browser and navigate to: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/orders` | Fetch all orders |
| **POST** | `/api/orders` | Create a new order |
| **PATCH** | `/api/orders/:id` | Update an order's status |
| **DELETE**| `/api/orders/:id` | Cancel/delete an order |
| **GET** | `/health` | System health check status |

---

## 🧪 Testing Real-Time Events (curl)

Create a new order via terminal to see the UI update instantly on the screen:

```bash
# Create a new order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Alex Mercer","product_name":"Mechanical Keyboard"}'

# Update the order status
curl -X PATCH http://localhost:5000/api/orders/<ORDER_ID> \
  -H "Content-Type: application/json" \
  -d '{"status":"shipped"}'
```

---

## 🏢 Production Deployment (PM2)

For clustering and production-grade process management:

```bash
cd server
npm install -g pm2
pm2 start ecosystem.config.js
pm2 status
pm2 logs
```

---

## 📁 Directory Structure

```text
realtime-orders/
├── server/
│   ├── src/
│   │   ├── config/         # MongoDB and Redis connection clients
│   │   ├── models/         # Mongoose validation schemas
│   │   ├── routes/         # Express routing definitions
│   │   ├── controllers/    # API Request Handlers
│   │   ├── services/       # Change Streams, Redis publisher
│   │   ├── socket/         # Socket.io connection handlers
│   │   ├── middleware/     # Body validation & general error handler
│   │   └── utils/          # Winston logging utilities
│   ├── .env.example
│   ├── ecosystem.config.js # PM2 Cluster configuration file
│   └── server.js           # Server bootstrap
└── client/
    ├── src/
    │   ├── components/     # React presentation components
    │   ├── hooks/          # useOrders state hook (WebSockets listener)
    │   ├── services/       # Axios API wrapper functions
    │   ├── socket.js       # Socket.io client setup
    │   └── App.jsx         # Primary App view
```
