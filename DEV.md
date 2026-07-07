## Running servers

**Terminal 1 — backend:**
## mySql
sudo service mysql start
sudo service mysql status

**Terminal 2 — backend:**
cd backend && ./mvnw spring-boot:run

Wait for `Started JobsApplication`. Runs on port 8080.

**Terminal 3 — frontend:**
cd frontend && npm run dev

Runs on port 3000.

## Codespaces port forwarding

Both ports need to be forwarded and set to **Public** visibility (PORTS tab → right-click → Port Visibility) for the frontend's server-side fetches and any external API testing (Postman, etc.) to reach the backend.

## Common issues

- **`./mvnw: Permission denied`** → `chmod +x mvnw`
- **MySQL socket permission denied** → `sudo chmod 755 /var/run/mysqld/`
- **Backend won't start, `Access denied for user`** → check `application.properties` datasource credentials match what you created in MySQL
- **Frontend `fetch failed` / `ECONNREFUSED`** → backend isn't running or hasn't finished starting yet

Company account (ROLE_COMPANY)

Username: testcompany
Password: TestPass123!
Email: testcompany@example.com

Admin account (ROLE_SUPER_ADMIN)

Username: admin
Password: 12345678
Email: admin@alchematch.local (double check this against your actual application.properties if it's been a while)