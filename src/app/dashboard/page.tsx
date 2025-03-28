"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import { fetchOrders } from "@/lib/features/orders/orderSlice";
import { fetchChats } from "@/lib/features/chat/chatSlice";
import Link from "next/link";
import { format } from "date-fns";

interface Message {
  _id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

interface Order {
  _id: string;
  type: string;
  symbol: string;
  price: number;
  quantity: number;
  status: "review" | "processing" | "completed";
  createdAt: string;
}

interface Chat {
  _id: string;
  orderId: string;
  isActive: boolean;
  messages: Message[];
  updatedAt: string;
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth?.user);
  const orders = useSelector((state: RootState) => state?.orders.orders);
  const chats = useSelector((state: RootState) => state?.chat.chats);

  useEffect(() => {
    dispatch(fetchOrders() as unknown as any);
    dispatch(fetchChats(user?.role as string) as unknown as any);
  }, [dispatch]);

  const recentOrders = orders.slice(0, 5);
  const recentChats = chats.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome, {user?.email}
        </h2>
        <p className="text-gray-600">You are logged in as a {user?.role}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Link
              href="/dashboard/orders"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order: Order) => (
              <div
                key={order._id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/dashboard/orders/${order._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.type} {order.symbol}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {order.quantity}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === "review"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Created on {format(new Date(order.createdAt), "PPP")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Chats</h3>
            <Link
              href="/dashboard/chat"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentChats.map((chat: Chat) => (
              <div
                key={chat._id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  router.push(
                    `/dashboard/chat/${chat._id}?orderId=${chat.orderId}`
                  )
                }
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{chat?.orderId}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      chat.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {chat.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Last updated {format(new Date(chat.updatedAt), "PPP")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
