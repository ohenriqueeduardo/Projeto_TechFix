import express from 'express';
import cors from 'cors';
import { apiRoutes } from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', apiRoutes);

// Rota raiz - Welcome message
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the TechFix Backend API!',
    status: 'ok',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

const PORT = process.env.PORT || 3000;

// Global error handler - converts HTML error pages to clean JSON responses
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled internal error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Ocorreu um erro inesperado no servidor.'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
