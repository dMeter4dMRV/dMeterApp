# Start backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; uvicorn app.main:app --reload"

# Start frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start" 