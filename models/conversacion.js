import mongoose from 'mongoose';

const esquemaMensaje = new mongoose.Schema({
  experto: {
    type: String,
    enum: ['psicologo', 'guia_espiritual'],
    required: true, 
  },
  mensaje: {
    type: String,
    required: true, 
  },
  fechaHora: {
    type: Date,
    default: Date.now, 
  },
});

const Conversacion = mongoose.model('Conversacion', esquemaMensaje);
export default Conversacion;