require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db');
const authMiddleware = require('./src/middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/students', authMiddleware, require('./src/routes/students'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

connectDB().then(() => {
  const port = process.env.PORT || 5050;
  app.listen(port, () => console.log(`[API] listening on http://localhost:${port}`));
}).catch(err => {
  console.error('[DB] connection error:', err);
  process.exit(1);
});
