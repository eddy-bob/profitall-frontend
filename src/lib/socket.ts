import { store } from './store';
import { addMessage } from './features/chat/chatSlice';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001';

interface WebSocketMessage {
  type: 'join_chat' | 'send_message' | 'leave_chat' | 'new_message' | 'chat_closed';
  data: {
    chatRoomId?: string;
    content?: string;
    id?: string;
    userId?: string;
    chatId?: string;
    createdAt?: string;
  };
}

class WebSocketService {
  private socket: WebSocket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = new WebSocket(SOCKET_URL);
      const token = localStorage.getItem('token');

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        // Send authentication message
        if (token) {
          this.socket?.send(JSON.stringify({
            type: 'auth',
            data: { token }
          }));
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.socket = null;
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          switch (message.type) {
            case 'new_message':
              if (message.data.id && message.data.content && message.data.userId && message.data.chatId && message.data.createdAt) {
                store.dispatch(addMessage({
                  id: message.data.id,
                  content: message.data.content,
                  userId: message.data.userId,
                  chatId: message.data.chatId,
                  createdAt: message.data.createdAt,
                }));
              }
              break;
            case 'chat_closed':
              // Handle chat closed event
              break;
            default:
              console.warn('Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  joinChat(chatId: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'join_chat',
        data: { chatRoomId: chatId },
      }));
    }
  }

  leaveChat(chatId: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'leave_chat',
        data: { chatRoomId: chatId },
      }));
    }
  }

  sendMessage(chatId: string, content: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'send_message',
        data: { chatRoomId: chatId, content },
      }));
    }
  }
}

export const socketService = new WebSocketService();