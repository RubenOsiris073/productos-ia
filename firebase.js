const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fkaw2-6c776-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

function logPrediction(label, similarity, metadata = {}) {
  const now = new Date();

  // Formatear la fecha como dd-mm-yyyy para el nombre de la colección
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const collectionName = `${dd}-${mm}-${yyyy}`;

  // Formatear la hora en formato 12 hrs para el nombre del documento (hh:mm AM/PM)
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes} ${ampm}`;

  const docName = `${label} ${timeStr}`;

  // Registrar en Firestore, integrando metadata adicional
  return db.collection(collectionName)
    .doc(docName)
    .set({ 
      similitud: similarity,
      metadata: {
        device: metadata.device || null,
        network: metadata.network || null,
        camera: metadata.camera || null,
        user: metadata.user || null,
        os: metadata.os || null,
        location: metadata.location || null,
        timestamp: now.toISOString()
      }
    });
}

module.exports = { logPrediction };