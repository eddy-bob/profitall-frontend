"use client";

import React, { useEffect, useState, useRef } from "react";
import { chatApi } from "@/lib/api";
import toast from "react-hot-toast";
import { useSocket } from "@/lib/hooks/useSocket";
import { useSearchParams } from "next/navigation";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
interface Message {
  _id: string;
  content: string;
  senderId: string;
  sender?: string;
  createdAt: string;
}

export default function SingleChatPage({ params }: { params: { id: string } }) {
  const chatRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const user = useSelector((state: RootState) => state.auth.user);
  const { id } = params; // Chat room ID from the URL
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const socket = useSocket(); // Custom hook to manage WebSocket connection

  // Fetch messages for the chat room
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await chatApi.getChatRoomMessagesById(id);
        const screenedData = response.data.map(
          (message: { sender: { _id: string } }) => {
            return {
              ...message,
              sender: message.sender._id,
            };
          }
        );
        setMessages(screenedData || []);
        chatRef.current?.scrollTo(0, chatRef.current?.scrollHeight);
      } catch (error) {
        toast.error("Failed to fetch messages.");
      }
    };

    fetchMessages();
  }, [id]);
  // Listen for incoming WebSocket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "newMessage" && data.orderId === orderId) {
        setMessages((prev) => [...prev, data.message]);
        chatRef.current?.scrollTo(0, chatRef.current?.scrollHeight);
      }
      if (data.type === "error") {
        toast.error(data.content);
      }
    };
    if (socket.socket) {
      socket.socket.onmessage = (event) => {
        handleMessage(event);
      };
    }
  }, [socket, id]);
  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const message = {
      type: "message",
      orderId,
      senderId: user?._id,
      chatId: id,
      content: newMessage,
    };
    if (socket.socket?.readyState === WebSocket.OPEN) {
      socket.socket.send(JSON.stringify(message));
      setNewMessage(""); // Clear the input field
    } else {
      toast.error("WebSocket is not open. Cannot send message.");
    }
  };

  return (
    <div className="space-y-6 lg:mx-20">
      <h1 className="text-2xl font-bold">Chat Room</h1>

      {/* Messages List */}
      <div
        ref={chatRef}
        className="p-4  bg-white rounded shadow space-y-2 overflow-y-auto max-h-96 min-h-[60vh]"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.sender === user?._id
                ? "bg-gray-100 ml-auto"
                : "bg-gray-300 mr-auto"
            } p-2  rounded-lg w-2/6 `}
          >
            <p className="text-sm">{message.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Send Message Form */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
