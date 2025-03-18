import express from 'express';
import cors from 'cors';
import { config } from './config';
import { environmentalRoutes } from './routes/environmental';
import { researchRoutes } from './routes/research';
import { governanceRoutes } from './routes/governance';
import { tokenRoutes } from './routes/token';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Routes
app.use('/api/environmental', environmentalRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/token', tokenRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling
app.use(errorHandler);

export const startServer = () => {
  const port = config.port;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}; 