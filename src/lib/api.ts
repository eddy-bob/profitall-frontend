import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { store } from "@/lib/store";
import { logout } from "@/lib/features/auth/authSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/users/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/users/login", data),
  getProfile: () => api.get("/users/profile"),
};

// Order endpoints
export const orderApi = {
  createOrder: (data: {
    type: string;
    symbol: string;
    price: number;
    quantity: number;
  }) => api.post("/orders", data),
  getOrders: () => api.get("/orders"),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
  updateOrderStatus: (id: string, data: { status: string }) =>
    api.patch(`/orders/${id}/status`, data),
};

// Chat endpoints
export const chatApi = {
  getChatRooms: () => api.get("/chat"),
  getUserChatRooms: () => api.get("/chat/my-chats"),
  createChatRoom: (orderId: string) => api.post("/chat/rooms", { orderId }),
  getChatRoomById: (id: string) => api.get(`/chat/${id}`),
  getChatRoomMessagesById: (id: string) => api.get(`/chat/${id}/messages`),
  closeChatRoom: (id: string, data: { summary: string }) =>
    api.post(`/chat/rooms/${id}/close`, data),
  createMessage: (chatRoomId: string, content: string) =>
    api.post(`/chat-rooms/${chatRoomId}/messages`, { content }),
};
