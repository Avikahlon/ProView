require('dotenv').config();
const express = require('express');
const cors = require('cors');
const teamsRouter = require('./routes/teams');
const playersRouter = require('./routes/players');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', teamsRouter);
app.use('/api', playersRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

app.listen(PORT, () => {
  console.log(`LoL pipeline API listening on http://localhost:${PORT}`);
});