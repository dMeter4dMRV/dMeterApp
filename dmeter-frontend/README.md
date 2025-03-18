# dMeter - Environmental Analysis Platform

dMeter is a comprehensive environmental analysis platform that combines air quality monitoring, weather data analysis, satellite imagery processing, and environmental asset management.

## Features

- Real-time air quality monitoring
- Weather data visualization
- Satellite imagery analysis
- Environmental asset tracking
- Salt management system

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- Recharts for data visualization
- React Router for navigation
- Axios for API requests

### Backend
- FastAPI (Python)
- SQLAlchemy for database management
- PostgreSQL database
- Uvicorn ASGI server

## Getting Started

### Prerequisites
- Node.js (v18.16.0 or higher)
- Python 3.10 or higher
- PostgreSQL

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd dmeter-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your API keys:
   ```
   REACT_APP_OPENAQ_API_KEY=your_openaq_api_key
   REACT_APP_OPEN_METEO_API_KEY=your_open_meteo_api_key
   REACT_APP_SENTINEL_INSTANCE_ID=your_sentinel_instance_id
   REACT_APP_SENTINEL_API_KEY=your_sentinel_api_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd dmeter/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows
   source venv/bin/activate      # Unix/macOS
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Project Structure

```
dmeter/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   ├── public/
│   └── package.json
└── backend/
    ├── app/
    │   ├── api/
    │   ├── core/
    │   ├── models/
    │   └── schemas/
    └── requirements.txt
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 