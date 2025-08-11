const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PY_SERVER = process.env.PY_SERVER || 'http://localhost:8000';

app.post('/api/predict', async (req, res) => {
  try {
    const r = await axios.post(`${PY_SERVER}/predict`, { text: req.body.text });
    res.json(r.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'prediction failed' });
  }
});

app.listen(3001, ()=> console.log('Proxy server running on http://localhost:3001'));