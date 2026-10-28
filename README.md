# Taskify - MERN Stack To-Do List

A full-stack task manager built with **MongoDB, Express.js, React.js and Node.js**.
Create, edit, complete and delete tasks, filter pending/completed tasks, see live stats, and switch between light and dark mode.

```
taskify/
├── server/                 Express + Mongoose REST API
│   ├── config/db.js        MongoDB connection
│   ├── models/Task.js      Task schema (title, description, status, timestamps)
│   ├── controllers/        CRUD logic
│   ├── routes/             API routes
│   ├── middleware/         Error handling
│   ├── test/api.test.js    API tests (npm test)
│   ├── seed.js             Demo data (npm run seed)
│   └── .env                PORT and MONGO_URI
└── client/                 React (Vite) frontend
    └── src/                components, pages, api.js (Axios), index.css
```

## API

| Method | Route                     | What it does                                   |
|--------|---------------------------|------------------------------------------------|
| GET    | `/api/tasks?status=...`   | List tasks (`all`, `pending` or `completed`)   |
| GET    | `/api/tasks/stats`        | `{ total, pending, completed }`                |
| POST   | `/api/tasks`              | Create a task (`title`, optional `description`)|
| PUT    | `/api/tasks/:id`          | Update title, description or status            |
| PATCH  | `/api/tasks/:id/toggle`   | Switch pending <-> completed                   |
| DELETE | `/api/tasks/:id`          | Delete a task                                  |

---

## Run it on Lubuntu (terminal)

You need **Node.js 20.19 or newer** and **MongoDB**. Steps 1 and 2 are one-time setup.

### 1. Install Node.js 22

```bash
node -v        # already v20.19+ or v22+ ? then skip to step 2
```

If not:

```bash
sudo apt update
sudo apt install -y curl gnupg ca-certificates
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v
```

### 2. Install and start MongoDB 8.0

Find your Ubuntu codename (Lubuntu 24.04 = `noble`, Lubuntu 22.04 = `jammy`):

```bash
lsb_release -cs
```

Then run (replace `noble` with `jammy` on 22.04):

```bash
sudo apt-get install -y gnupg curl
curl -fsSL https://pgp.mongodb.com/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod        # start automatically at boot
sudo systemctl status mongod        # should say: active (running)   (press q to exit)
```

### 3. Get the project and install packages

```bash
cd ~/Downloads                      # or wherever you saved the zip
sudo apt install -y unzip
unzip taskify.zip
cd taskify

cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 4. Run it - pick ONE way

**Way A: development mode (two terminals, auto-reload)**

Terminal 1 (backend):
```bash
cd taskify/server
npm run dev
```
You should see `MongoDB connected` and `Taskify API running on http://localhost:5000`.

Terminal 2 (frontend):
```bash
cd taskify/client
npm run dev
```
Open **http://localhost:5173** in the browser.

**Way B: single command (build the frontend once, Express serves everything)**

```bash
cd taskify/client && npm run build && cd ..
cd server && npm start
```
Open **http://localhost:5000**.

Stop either way with `Ctrl + C`.

### 5. Optional extras

```bash
cd taskify/server
npm run seed      # loads 12 demo tasks (7 pending, 5 completed) - DELETES existing tasks
npm test          # runs the API tests against a separate "taskify_test" database
```

### Troubleshooting

| Problem | Fix |
|---|---|
| `Could not connect to MongoDB` / `ECONNREFUSED 127.0.0.1:27017` | MongoDB is not running: `sudo systemctl start mongod`, then check `sudo systemctl status mongod` |
| `mongod` exits with `Illegal instruction` | The CPU has no AVX, which MongoDB 5+ needs. Check with `grep -c avx /proc/cpuinfo` (0 = unsupported). Use a free MongoDB Atlas cluster instead and put its connection string in `server/.env` as `MONGO_URI=...` |
| `EADDRINUSE ... :5000` | Something else uses port 5000. Change `PORT` in `server/.env` **and** the proxy port in `client/vite.config.js` |
| Page says "Cannot reach the server" | The backend (terminal 1) is not running, or crashed. Start it again |
| `npm install` errors about Node version | Node is too old. Redo step 1 |
| `Unit mongod.service not found` | `sudo systemctl daemon-reload` and start again |

### Using MongoDB Atlas or Docker instead of a local install

- **Atlas:** create a free cluster, copy the connection string and set it in `server/.env`:
  `MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/taskify`
- **Docker:** `docker run -d --name taskify-mongo -p 27017:27017 -v taskify-mongo:/data/db mongo:8` (keep the default `MONGO_URI`)
