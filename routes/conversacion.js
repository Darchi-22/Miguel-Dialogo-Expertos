import { Router } from "express";
import {
    obtenerConversacion,        
    iniciarConversacionInicial, 
    obtenerConversacionPsicologo,
    obtenerConversacionGuia,     
    eliminarConversacion         
} from '../controllers/conversacion.js';

const enrutador = Router(); 

enrutador.get('/', obtenerConversacion);
enrutador.post('/psicologo', iniciarConversacionInicial);
enrutador.get('/psicologo', obtenerConversacionPsicologo);
enrutador.post('/guia_espiritual', iniciarConversacionInicial);
enrutador.get('/guia_espiritual', obtenerConversacionGuia);
enrutador.delete('/', eliminarConversacion);

export default enrutador; 