const express = require('express');
const bodyParser = require('body-parser');
const { logPrediction } = require('./firebase'); // Importa la función

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Endpoint para registrar la predicción
app.post('/logPrediction', (req, res) => {
  const { label, similarity } = req.body;
  if (!label || !similarity) {
    return res.status(400).send({ error: 'Faltan parámetros' });
  }

  logPrediction(label, similarity)
    .then(() => {
      console.log(`Predicción registrada: ${label}`);
      res.send({ success: true });
    })
    .catch(err => {
      console.error("Error al registrar en Firebase:", err);
      res.status(500).send({ error: err.message });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});