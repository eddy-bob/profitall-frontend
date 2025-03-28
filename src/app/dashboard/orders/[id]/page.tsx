"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import {
  fetchOrder,
  updateOrderStatus,
} from "@/lib/features/orders/orderSlice";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state?.auth?.user);
  const order = useSelector((state: RootState) => state?.orders?.currentOrder);

  useEffect(() => {
    dispatch(fetchOrder(params.id) as unknown as any);
  }, [dispatch, params.id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const handleStatusUpdate = async (newStatus: "COMPLETED" | "CANCELLED") => {
    try {
      await dispatch(
        updateOrderStatus({
          orderId: order._id,
          status: newStatus,
        }) as unknown as any
      ).unwrap();
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-primary hover:text-primary/80"
        >
          Back to Orders
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Information
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Symbol</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.symbol}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.price}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.quantity}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "COMPLETED"
                        ? "bg-blue-100 text-green-800"
                        : "bg-green-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(order.createdAt), "PPP")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(order.updatedAt), "PPP")}
                </dd>
              </div>
            </dl>
          </div>

          {user?.role === "admin" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Actions
              </h2>
              <div className="space-y-4">
                {(order.status === "COMPLETED" ||
                  order.status === "PENDING") && (
                  <button
                    onClick={() => handleStatusUpdate("CANCELLED")}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Move to Cancelled
                  </button>
                )}
                {order.status === "PENDING" && (
                  <button
                    onClick={() => handleStatusUpdate("COMPLETED")}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
