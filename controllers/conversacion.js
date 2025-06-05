import Conversacion from '../models/conversacion.js';
import { obtenerRespuestaGemini } from '../services/gemini.js';

export const obtenerConversacion = async (req, res) => {
    try {
        const conversacion = await Conversacion.find().sort({ fechaHora: 1 });  
        res.json(conversacion);
    } catch (err) {
        console.error('Error al buscar la conversación:', err);
        res.status(500).json({ error: 'Error obteniendo la conversación' });
    }
};

export const iniciarConversacionInicial = async (req, res) => {
    try {
        const { experto, mensaje } = req.body; 
        const historialExistente = await Conversacion.find();

        if (historialExistente.length === 0) {
            await Conversacion.deleteMany({});

            const mensajesIntroductorios = [
                "Hola, ¿cómo has estado?",
                "Quiero comentarte algo, hace poco hablé con un cliente que me hizo una pregunta muy interesante que me llevó tiempo responder.",
                "Por ello, quisiera saber tu opinión sobre ella y me gustaría saber qué habrías respondido tú."
            ];

            for (const texto of mensajesIntroductorios) {
                const intro = new Conversacion({
                    experto: experto, 
                    mensaje: texto,
                    fechaHora: new Date()
                });
                await intro.save();
            }

            const msgDelExperto = new Conversacion({
                experto: experto,
                mensaje: mensaje, 
                fechaHora: new Date()
            });
            await msgDelExperto.save();

            const otroExperto = '';
            if(experto === 'psicologo'){
              otroExperto = 'guia_espiritual';
            } else {
              otroExperto = 'psicologo'
            }

            const historialParaGemini = await Conversacion.find().sort({ fechaHora: 1 }); 
            const textoRespuesta = await obtenerRespuestaGemini(otroExperto, mensaje, historialParaGemini); 

            const msgDelOtro = new Conversacion({
                experto: otroExperto,
                mensaje: textoRespuesta,
                fechaHora: new Date()
            });
            await msgDelOtro.save();
            res.json({ success: true, mensajeInicial: msgDelExperto, respuesta: msgDelOtro });

        } else {
            console.warn("ADVERTENCIA: 'iniciarConversacionInicial' llamada con historial existente. Esto solo debería usarse para el primer mensaje.");
            res.status(400).json({ error: "No se puede iniciar una conversación si ya existe. Usa las rutas GET para continuar." });
        }

    } catch (err) {
        console.error('Error procesando el mensaje inicial o respuesta:', err);
        res.status(500).json({ error: 'Error procesando el mensaje inicial o respuesta' });
    }
};

export const obtenerConversacionPsicologo = async (req, res) => {
    try {
        const experto = 'psicologo';
        const historialConversacion = await Conversacion.find().sort({ fechaHora: 1 });
        const ultimoMensaje = historialConversacion.length > 0 ? historialConversacion[historialConversacion.length - 1].mensaje : "";

        if (!ultimoMensaje) {
             return res.status(400).json({ error: "No hay un mensaje previo al cual el psicólogo pueda responder." });
        }

        const textoRespuesta = await obtenerRespuestaGemini(experto, ultimoMensaje, historialConversacion);
        const msgDelExperto = new Conversacion({
            experto: experto,
            mensaje: textoRespuesta,
            fechaHora: new Date()
        });
        await msgDelExperto.save();
        res.json({ respuesta: msgDelExperto });

    } catch (err) {
        console.error('Error en GET /api/conversacion/psicologo:', err);
        res.status(500).json({ error: 'Error procesando la conversación del psicólogo' });
    }
};

export const obtenerConversacionGuia = async (req, res) => {
    try {
        const experto = 'guia_espiritual';
        const historialConversacion = await Conversacion.find().sort({ fechaHora: 1 });
        const ultimoMensaje = historialConversacion.length > 0 ? historialConversacion[historialConversacion.length - 1].mensaje : "";

        if (!ultimoMensaje) {
            return res.status(400).json({ error: "No hay un mensaje previo al cual el guía espiritual pueda responder." });
        }

        const textoRespuesta = await obtenerRespuestaGemini(experto, ultimoMensaje, historialConversacion);
        const msgDelExperto = new Conversacion({
            experto: experto,
            mensaje: textoRespuesta,
            fechaHora: new Date()
        });
        await msgDelExperto.save();
        res.json({ respuesta: msgDelExperto });

    } catch (err) {
        console.error('Error en GET /api/conversacion/guia_espiritual:', err);
        res.status(500).json({ error: 'Error procesando la conversación del guía espiritual' });
    }
};

export const eliminarConversacion = async (req, res) => {
    try {
        await Conversacion.deleteMany({});
        res.json({ message: 'Conversación borrada correctamente' });
    } catch (err) {
        console.error('Error borrando la conversación:', err);
        res.status(500).json({ error: 'Error borrando la conversación' });
    }
};