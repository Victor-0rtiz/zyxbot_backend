import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as fs from 'fs';
import * as path from 'path';
import ollama from 'ollama';

@WebSocketGateway({
  namespace: '/socket-unan-managua',
  cors: {
    origin: 'http://localhost:4200', // Permitir solicitudes desde esta URL
    methods: ['GET', 'POST'],

    credentials: true,
  },
})
export class UnanManaguaGateway {
  @WebSocketServer()
  server: Server; // * Servidor WebSocket


  private info: any[]; // ? Almacena información de los archivos cargados

  constructor() {
    // * Ruta de los documentos que contienen información sobre la UNAN-Managua
    const directoryPath = './documents/unanmanagua';
    this.info = [];

    // * Leer archivos del directorio especificado
    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
      const filePath = path.join(directoryPath, file); // * Obtener la ruta completa de cada archivo
      const fileContent = fs.readFileSync(filePath, 'utf8'); // * Leer el contenido de cada archivo
      this.info.push({ fileName: file, content: fileContent });
    });

    // console.log(this.info);
    
  }

  @SubscribeMessage('chat')
  async handleChatMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): Promise<void> {

    // console.log('Mensaje del usuario:', data); // ! Mensaje recibido del usuario
    // console.log('id Socket usuario:', client.id); // ! ID del socket del usuario
    const userMessage = data;



    // * Definir el prompt inicial para el asistente ZyxBot
    const prompt = `Tú eres ZyxBot, un asistente virtual especializado en proporcionar información precisa sobre la Universidad Nacional Autónoma de Nicaragua (UNAN-Managua). Tu misión es responder preguntas relacionadas con esta institución de educación superior en Nicaragua. Sigue estas instrucciones:
Basa tus respuestas en la información específica que has recibido sobre UNAN-Managua y solo UNAN-MANAGUA.
No especules ni proporciones información no confirmada.
Mantén un tono profesional y objetivo en tus respuestas.
Organiza tu respuesta de manera clara y estructurada.
Usa lenguaje técnico apropiado cuando sea relevante.
Siempre comienza tu respuesta mencionando explícitamente que estás hablando de UNAN-Managua.
Incluye detalles específicos sobre la historia, ubicación, programas académicos y características únicas de la universidad.
Si se menciona "UNAN", entiende que se refiere a UNAN-Managua sin duda alguna.
Termina cada respuesta con una pregunta abierta que invite al usuario a profundizar en el tema si lo desea.
Comienza siempre tu respuesta con una declaración de confianza y alegría por estar encantado de responder.
Usa un tono amistoso pero profesional, como si estuvieras hablando con alguien interesado en aprender sobre UNAN-Managua.
Muestra seguridad en tus respuestas, usando frases con alegria.
Si necesitas información adicional para responder una pregunta compleja, pide educadamente: "Para poder responderte de manera precisa, ¿podrías proporcionar más detalles sobre tu pregunta?"
Mantén un lenguaje positivo enfocado en las fortalezas de UNAN-Managua, siempre buscando oportunidades de crecimiento y mejora.
Termina tu respuesta con una breve afirmación de tu compromiso con la precisión y calidad de la información proporcionada.
La UNAN-MANAGUA cuenta con áreas del conocimiento, antes conocidas como facultades, ahora estas áreas son: Área del Conocimiento de Ciencias Económicas y Administrativas, Ciencias Sociales y Jurídicas, Ciencias de la Salud, Ciencias Básicas y Tecnología, Educación, Arte y Humanidades.
Si se menciona "facultades", corrige automáticamente al término correcto "áreas del conocimiento".
Solo hablas de la UNAN-Managua, no de otras universidades, y tu información se basa en la proporcionada.
Ahora la prematricula se hace por medio de el sistema de matrícula en línea, el cual se encuentra en la página Https://admision.cnu.edu.ni.
Recuerda que eres un experto en UNAN-Managua y tienes toda la información necesaria para responder cualquier pregunta relacionada con esta institución educativa. ¡Disfruta compartiendo tus conocimientos!
Información relevante:
${this.info}`;
console.log(this.info);


    try {
      // * Llamar a Ollama con el historial de mensajes y el prompt del sistema
      const response = await ollama.chat({
        model: "llama3.1", // ? Modelo de lenguaje utilizado
        messages: [
          {
            role: 'system',
            content: prompt // * Prompt del sistema para iniciar la conversación
          },
          {
            role: 'user',
            content: userMessage // * Mensaje enviado por el usuario
          }
        ],
        stream: true // ? Habilitar el streaming de respuestas
      });

      // * Enviar la respuesta de Ollama al cliente a través del socket
      for await (const part of response) {
        this.server.emit('chat_response', { message: part.message.content, end: false });
        process.stdout.write(part.message.content); // ! Respuesta parcial de Ollama
      }

      // * Indicar al cliente que la respuesta ha terminado
      this.server.emit('chat_response', { message: "", end: true });


      // this.messageHistory.push({ role: 'assistant', content: response[response.length - 1].message.content });
    } catch (error) {
      console.error('Error al obtener respuesta de Ollama:', error); // ! Manejar el error al llamar a Ollama
      client.emit('chat_response', 'Lo siento, ocurrió un error al procesar tu solicitud.'); // ! Mensaje de error enviado al cliente
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Usuario desconectado'); // ! Indicar cuando un usuario se desconecta
  }
}

