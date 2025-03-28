import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import toast from "react-hot-toast";

export function useSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const user = useSelector((state: RootState) => state?.auth?.user);

  const connect = () => {
    if (!user) return;

    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:5000";
    const token = localStorage.getItem("token");

    socketRef.current = new WebSocket(`${SOCKET_URL}?token=${token}`);
    socketRef.current.onopen = () => {
      toast.success("WebSocket connected");
      // Send authentication message
      if (token) {
        socketRef.current?.send(
          JSON.stringify({
            type: "auth",
            data: { token },
          })
        );
      }
    };
    socketRef.current.onmessage = (event) => {
      console.log("Message received:", event.data);
    };
    socketRef.current.onclose = () => {
      toast.error("WebSocket disconnected");
      socketRef.current = null;
      const token = localStorage.getItem("token");
      if (!token) return;
      // Retry connection after a delay
      setTimeout(() => {
        console.log("Retrying WebSocket connection...");
        connect();
      }, 3000);
    };

    socketRef.current.onerror = (error: Event) => {
      console.error("WebSocket connection error:", error);
    };
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    connect,
    disconnect,
  };
}
