import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import conversationRouter from './routes/conversacion.js'; 

dotenv.config();

const app = express();
const PUERTO = process.env.PORT || 5000; 

app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dblocal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

app.use('/api/conversacion', conversationRouter);

app.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});