## Running servers

## mySql
sudo service mysql start
sudo service mysql status

**Terminal 1 — backend:**
```bash
cd backend
./mvnw spring-boot:run
```
Wait for `Started JobsApplication`. Runs on port 8080.

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```
Runs on port 3000.

## Codespaces port forwarding

Both ports need to be forwarded and set to **Public** visibility (PORTS tab → right-click → Port Visibility) for the frontend's server-side fetches and any external API testing (Postman, etc.) to reach the backend.

## Common issues

- **`./mvnw: Permission denied`** → `chmod +x mvnw`
- **MySQL socket permission denied** → `sudo chmod 755 /var/run/mysqld/`
- **Backend won't start, `Access denied for user`** → check `application.properties` datasource credentials match what you created in MySQL
- **Frontend `fetch failed` / `ECONNREFUSED`** → backend isn't running or hasn't finished starting yet

