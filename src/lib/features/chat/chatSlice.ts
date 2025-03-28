import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { chatApi } from "../../api";
import { socketService } from "../../socket";

interface Message {
  id: string;
  content: string;
  userId: string;
  chatId: string;
  createdAt: string;
}

interface Chat {
  id: string;
  orderId: string;
  isActive: boolean;
  summary?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
};

export const createChat = createAsyncThunk(
  "chat/create",
  async (orderId: string) => {
    const response = await chatApi.createChatRoom(orderId);
    return response.data;
  }
);
export const createMessage = createAsyncThunk(
  "chat/message/create",
  async ({ chatRoomId, content }: { chatRoomId: string; content: string }) => {
    const response = await chatApi.createMessage(chatRoomId, content);
    return response.data;
  }
);

export const fetchChats = createAsyncThunk(
  "chat/list",
  async (role: string) => {
    const response = await (role === "user"
      ? chatApi.getUserChatRooms()
      : chatApi.getChatRooms());
    return response.data;
  }
);

export const fetchChat = createAsyncThunk(
  "chat/get",
  async (chatId: string) => {
    const response = await chatApi.getChatRoomById(chatId);
    return response.data;
  }
);

export const closeChat = createAsyncThunk(
  "chat/close",
  async ({ chatId, summary }: { chatId: string; summary: string }) => {
    const response = await chatApi.closeChatRoom(chatId, { summary });
    return response.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearError: (state: ChatState) => {
      state.error = null;
    },
    setCurrentChat: (state: ChatState, action: PayloadAction<Chat>) => {
      state.currentChat = action.payload;
    },
    addMessage: (state: ChatState, action: PayloadAction<Message>) => {
      const message = action.payload;
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === message.chatId
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].messages.push(message);
      }
      if (state.currentChat?.id === message.chatId) {
        state.currentChat?.messages.push(message);
      }
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<ChatState>) => {
    builder
      // Create Chat
      .addCase(createChat.pending, (state: ChatState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createChat.fulfilled,
        (state: ChatState, action: PayloadAction<Chat>) => {
          state.loading = false;
          state.chats.push(action.payload);
          state.currentChat = action.payload;
          socketService.joinChat(action.payload.id);
        }
      )
      .addCase(
        createChat.rejected,
        (state: ChatState, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to create chat";
        }
      )
      // Fetch Chats
      .addCase(fetchChats.pending, (state: ChatState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChats.fulfilled,
        (state: ChatState, action: PayloadAction<Chat[]>) => {
          state.loading = false;
          state.chats = action.payload;
        }
      )
      .addCase(
        fetchChats.rejected,
        (state: ChatState, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to fetch chats";
        }
      )
      // Fetch Single Chat
      .addCase(fetchChat.pending, (state: ChatState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChat.fulfilled,
        (state: ChatState, action: PayloadAction<Chat>) => {
          state.loading = false;
          state.currentChat = action.payload;
          if (action.payload.isActive === true) {
            socketService.joinChat(action.payload.id);
          }
        }
      )
      .addCase(
        fetchChat.rejected,
        (state: ChatState, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to fetch chat";
        }
      )
      // Close Chat
      .addCase(closeChat.pending, (state: ChatState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        closeChat.fulfilled,
        (state: ChatState, action: PayloadAction<Chat>) => {
          state.loading = false;
          const index = state.chats.findIndex(
            (chat) => chat.id === action.payload.id
          );
          if (index !== -1) {
            state.chats[index] = action.payload;
          }
          if (state.currentChat?.id === action.payload.id) {
            state.currentChat = action.payload;
          }
          socketService.leaveChat(action.payload.id);
        }
      )
      .addCase(
        closeChat.rejected,
        (state: ChatState, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to close chat";
        }
      );
  },
});

export const { clearError, setCurrentChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
