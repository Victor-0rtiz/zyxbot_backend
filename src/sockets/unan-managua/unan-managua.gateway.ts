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
  }

  @SubscribeMessage('chat')
  async handleChatMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): Promise<void> {
  
    // console.log('Mensaje del usuario:', data); // ! Mensaje recibido del usuario
    // console.log('id Socket usuario:', client.id); // ! ID del socket del usuario
    const userMessage = data;

   
    
    // * Definir el prompt inicial para el asistente ZyxBot
    const prompt = `Tú eres ZyxBot, respondes en español y eres un asistente virtual especializado en proporcionar información sobre la Universidad de la UNAN-Managua...`;

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

