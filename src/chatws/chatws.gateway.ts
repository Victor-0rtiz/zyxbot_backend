import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as fs from 'fs';
import * as path from 'path';
import ollama from 'ollama';

@WebSocketGateway({
  namespace: '/ollama',
  cors: {
    origin: 'http://localhost:4200', // Permitir solicitudes desde esta URL
    methods: ['GET', 'POST'],

    credentials: true,
  },
})

export class ChatwsGateway {
  @WebSocketServer()
  server: Server;

  private messageHistory = [];
  private info: any[];

  constructor() {
    const directoryPath = './documents/unanmanagua';
    this.info = [];

    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      this.info.push({ fileName: file, content: fileContent });
    });
  }

  @SubscribeMessage('chat')
  async handleChatMessage(@MessageBody() data: string, client: Socket): Promise<void> {
    console.log('Mensaje del usuario:', data);
    const userMessage = data;

    // Agrega el mensaje del usuario al historial
    this.messageHistory.push({ role: 'user', content: userMessage });

    // Solo incluye el prompt en el primer mensaje
    if (this.messageHistory.length === 1) {
      const prompt = `Tú eres ZyxBot, respondes en español y eres un asistente virtual especializado en proporcionar información sobre la Universidad de la UNAN-Managua...`;

      // Agrega el prompt al historial
      this.messageHistory.unshift({ role: 'system', content: prompt });
    }

    try {
      // Llama a Ollama con el historial de mensajes
      const response = await ollama.chat({
        model: "llama3.1",
        messages: this.messageHistory,
        stream: true
      });

      // Envía la respuesta de Ollama al cliente
      for await (const part of response) {
        this.server.emit('chat_response', { message: part.message.content, end: false });
        process.stdout.write(part.message.content);
      }


      this.server.emit('chat_response', { message: "", end: true });


      // Agrega la respuesta de Ollama al historial
      // this.messageHistory.push({ role: 'assistant', content: response[response.length - 1].message.content });
    } catch (error) {
      console.error('Error al obtener respuesta de Ollama:', error);
      client.emit('chat_response', 'Lo siento, ocurrió un error al procesar tu solicitud.');
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Usuario desconectado');
  }
}
