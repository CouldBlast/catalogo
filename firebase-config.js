/* =========================================================
   CONFIGURACIÓN — Could Blast
   =========================================================
   Este archivo conecta tu página con tu base de datos (Firebase)
   y con Cloudinary (para subir fotos). Solo lo editas UNA VEZ,
   siguiendo INSTRUCCIONES.md. Después de configurarlo nunca más
   necesitas tocar código para agregar productos o tallas.
   ========================================================= */

// 1) Pega aquí la configuración que Firebase te da al crear tu proyecto.
//    La encuentras en: Configuración del proyecto (ícono de engranaje) > Tus apps > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDBCDFlso8jW-lrwLtTg8dE4A6XerGh8E",
  authDomain: "could-sneakers.firebaseapp.com",
  projectId: "could-sneakers",
  storageBucket: "could-sneakers.firebasestorage.app",
  messagingSenderId: "802659412844",
  appId: "1:802659412844:web:c249a8424a31e6a076e149"
};

// 2) Cloudinary — el "cloud name" ya es el tuyo (se ve en tus fotos actuales).
const CLOUDINARY_CLOUD_NAME = "dwqfpyw27";

// 3) Este "upload preset" lo creas tú en Cloudinary en modo "Unsigned"
//    (ver INSTRUCCIONES.md, paso de Cloudinary). Pon aquí el nombre que le diste.
const CLOUDINARY_UPLOAD_PRESET = "couldsneakers";

/* ========================================================= */
/*  No necesitas tocar nada debajo de esta línea             */
/* ========================================================= */
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
