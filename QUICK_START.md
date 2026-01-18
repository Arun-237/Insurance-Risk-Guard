# RiskGuard Quick Start Guide - Windows

## Prerequisites Setup

### 1. Add Maven to PATH (One-time setup)

Copy and paste this in PowerShell **as Administrator**:

```powershell
# Add Maven to PATH
$MavenPath = "C:\Users\$env:USERNAME\.maven\maven-3.9.12\bin"
$CurrentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($CurrentPath -notlike "*$MavenPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$CurrentPath;$MavenPath", "User")
    Write-Host "Maven added to PATH. Please close and reopen PowerShell."
} else {
    Write-Host "Maven is already in PATH"
}
```

After running this, **close and reopen PowerShell**.

### 2. Verify Setup

```powershell
mvn --version
# Should show Maven 3.9.12 and Java 17
```

---

## Starting the Application

### Option A: Using startup scripts (Easiest)

#### For Windows:
```powershell
cd C:\RiskGuard
.\start.bat
```

#### For Mac/Linux:
```bash
cd ~/RiskGuard
./backend/run.sh
```

---

### Option B: Manual startup

#### Terminal 1 - Backend:
```powershell
cd C:\RiskGuard\backend
mvn spring-boot:run
```

#### Terminal 2 - Frontend:
```powershell
cd C:\RiskGuard\frontend
npm install
npm start
```

---

### Option C: Using Docker Compose
```powershell
cd C:\RiskGuard
docker-compose up --build
```

---

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api  
- **Database**: localhost:1433

---

## Troubleshooting

### "mvn: The term 'mvn' is not recognized"

**Solution**: 
1. Check if Maven path is added: `echo $env:Path`
2. If not, run the PATH setup command above
3. Close and reopen PowerShell
4. Try again

### "Cannot find SQL Server"

**Solution**:
1. SQL Server Express must be running on localhost:1433
2. Check connection with:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 1433
   ```

### Build takes forever

**Solution**: First build downloads ~500MB of dependencies. Subsequent builds are faster.

### Port already in use

If port 8080 or 3000 is in use:

```powershell
# Find process using port 8080
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | 
    ForEach-Object { Get-Process -Id $_.OwningProcess }

# Kill process (replace PID)
Stop-Process -Id <PID> -Force
```

---

## Next Steps

Once both services are running:

1. Open http://localhost:3000 in browser
2. You should see RiskGuard dashboard
3. Click "Customers" to view sample data
4. Click "Underwriter" to see risk assessments

---

## Configuration

### Backend (Spring Boot)

Edit `backend/src/main/resources/application.properties`:

```properties
# Database connection
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=riskguard
spring.datasource.username=sa
spring.datasource.password=YourPassword@123

# Server port
server.port=8080
```

### Frontend (React)

Edit `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:8080/api
```

---

## Performance Tips

- First build takes **5-10 minutes** (downloads dependencies)
- Subsequent builds take **1-2 minutes**
- Keep both terminal windows visible for debugging
- Check browser console for frontend errors
- Check terminal output for backend errors

---

For more details, see README.md and SETUP.md
