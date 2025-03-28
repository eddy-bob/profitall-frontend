"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { createOrder, fetchOrders } from "@/lib/features/orders/orderSlice";
import { RootState } from "@/lib/store";
import toast from "react-hot-toast";

const orderSchema = z.object({
  type: z.enum(["BUY", "SELL"]),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(1, "Price is required"),
  symbol: z.string().min(1, "Symbol is required"),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function OrdersPage() {
  const dispatch = useDispatch();
  const [isCreating, setIsCreating] = useState(false); // State to toggle the form
  const user = useSelector((state: RootState) => state.auth.user); // Get the logged-in user
  const orders = useSelector((state: RootState) => state.orders.orders); // Get the list of orders

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  useEffect(() => {
    dispatch(fetchOrders() as unknown as any); // Fetch all orders on page load
  }, [dispatch]);

  const onSubmit = async (data: OrderFormData) => {
    try {
      await dispatch(createOrder(data) as unknown as any).unwrap();
      toast.success("Order created successfully!");
      setIsCreating(false); // Close the form after successful creation
    } catch (error) {
      toast.error("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Order Button (Visible only to role 'user') */}
      {user?.role === "user" && (
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
        >
          {isCreating ? "Cancel" : "Create Order"}
        </button>
      )}

      {/* Create Order Form (Visible only when isCreating is true) */}
      {isCreating && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              {...register("type")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Type</option>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Symbol
            </label>
            <input
              {...register("symbol")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.symbol && (
              <p className="mt-1 text-sm text-red-600">
                {errors.symbol.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            Create Order
          </button>
        </form>
      )}

      {/* Orders List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders</h2>
        {orders.length > 0 ? (
          <ul className="space-y-2">
            {orders.map((order) => (
              <li key={order.id} className="p-4 bg-gray-100 rounded">
                <p className="text-sm font-medium text-gray-800">
                  {order.symbol} - {order.type}
                </p>
                <p className="text-sm text-gray-600">
                  Quantity: {order.quantity}, Price: {order.price}
                </p>
                <p className="text-xs text-gray-400">
                  Status: {order.status}, Created At: {order.createdAt}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No orders available.</p>
        )}
      </div>
    </div>
  );
}
