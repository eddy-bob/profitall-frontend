"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { chatApi } from "@/lib/api";
import toast from "react-hot-toast";

interface ChatRoom {
  _id: string;
  orderId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ChatPage() {
  const user = useSelector((state: RootState) => state.auth.user); // Get the logged-in user
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const router = useRouter();

  // Fetch chat rooms based on user role
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response =
          user?.role === "admin"
            ? await chatApi.getChatRooms()
            : await chatApi.getUserChatRooms();
        setChatRooms(response.data || []);
      } catch (error) {
        toast.error("Failed to fetch chat rooms.");
      }
    };

    fetchChats();
  }, [user]);

  // Redirect to the single chat page
  const openChatRoom = (chatRoom: ChatRoom) => {
    router.push(`/dashboard/chat/${chatRoom._id}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Chat Rooms</h1>

      {/* Chat Rooms List */}
      <div className="space-y-4">
        {chatRooms.map((chatRoom) => (
          <div
            key={chatRoom.id}
            className="p-4 bg-gray-100 rounded shadow cursor-pointer"
            onClick={() => openChatRoom(chatRoom)}
          >
            <p className="text-sm font-medium">Order ID: {chatRoom.orderId}</p>
            <p className="text-sm text-gray-600">
              Status: {chatRoom.isActive ? "Open" : "Closed"}
            </p>
            <p className="text-xs text-gray-400">
              Created At: {new Date(chatRoom.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
