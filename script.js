const video = document.getElementById('video');
const predictionsElement = document.getElementById('predictions');
let model;

// Forzar uso del backend CPU
tf.setBackend('cpu');
tf.ready().then(() => {
  // Acceder a la cámara del dispositivo
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
      video.srcObject = stream;
    })
    .catch(function(err) {
      console.error("Error al acceder a la cámara: ", err);
    });

  // Cargar el modelo
  tf.loadLayersModel('model.json')
    .then(m => {
      model = m;
      console.log("Modelo cargado");
      runDetection();
    })
    .catch(err => console.error("Error al cargar el modelo: ", err));
});

// Función para registrar la predicción en Firestore
function logPrediction(label, similarity) {
  fetch('http://localhost:3000/logPrediction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label, similarity })
  })
  .then(response => response.json())
  .then(data => console.log('Predicción registrada:', data))
  .catch(err => console.error("Error al registrar la predicción:", err));
}

// Ejecución continua de predicciones
function runDetection() {
  function detectFrame() {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      // Procesamos cada frame dentro de tf.tidy para limpiar tensores innecesarios
      tf.tidy(() => {
        const tensor = tf.browser.fromPixels(video)
          .resizeNearestNeighbor([224, 224]) // Ajusta el tamaño según tu modelo
          .expandDims()
          .toFloat();

        // Realizar la predicción de forma sincrónica
        const predictions = model.predict(tensor).dataSync();
        const maxProb = Math.max(...predictions);
        const idx = predictions.indexOf(maxProb);

        // Mapea el índice a la etiqueta correspondiente (personaliza tu mapeo)
        const etiquetas = ["barrita", "botella", "chicle"];
        const label = etiquetas[idx] || "Desconocido";
        const similarity = (maxProb * 100).toFixed(2);
        predictionsElement.innerHTML = `Label: ${label} - Precisión: ${similarity}%`;

        // Registrar en Firebase
        logPrediction(label, similarity);
      });
    }
    requestAnimationFrame(detectFrame);
  }
  detectFrame();
}
