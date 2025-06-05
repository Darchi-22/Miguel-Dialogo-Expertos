import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const contenidoPromptPsicologo = fs.readFileSync(new URL('../prompts/promptPsicologo.txt', import.meta.url), 'utf-8');
const contenidoPromptGuiaEspiritual = fs.readFileSync(new URL('../prompts/promptGuiaEspiritual.txt', import.meta.url), 'utf-8');

const promptsSistema = {
    'psicologo': contenidoPromptPsicologo,
    'guia_espiritual': contenidoPromptGuiaEspiritual
};

const CLAVE_API = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(CLAVE_API);

export async function obtenerRespuestaGemini(experto, mensajeActual, historialConversacion = []) {
    if (!(experto in promptsSistema)) {
        throw new Error(`Experto desconocido: "${experto}". No se encontró un prompt de sistema para este experto.`);
    }

    const contenidoPromptSistema = promptsSistema.experto;

    const modelo = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const historialParaGemini = [
        {
            role: 'user',
            parts: [{ text: contenidoPromptSistema }]
        },
        {
            role: 'model',
            parts: [{ text: "Entendido. ¿Cómo puedo ayudarte desde esta perspectiva?" }]
        },
    ];

    historialConversacion.forEach(msg => {
        historialParaGemini.push({
  
            role: msg.experto === experto ? 'model' : 'user',
            parts: [{ text: msg.mensaje }] 
        });
    });

    const chat = modelo.startChat({
        history: historialParaGemini,
    });

    const resultado = await chat.sendMessage(mensajeActual);
    const respuesta = await resultado.response;
    const textoRespuesta = respuesta.text();

    console.log(textoRespuesta);
    return textoRespuesta.trim();
}