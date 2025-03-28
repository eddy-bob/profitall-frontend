"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect after 3 seconds
    const timeout = setTimeout(() => {
      if (token) {
        router.push("/dashboard"); // Redirect to dashboard if logged in
      } else {
        router.push("/login"); // Redirect to login if not logged in
      }
    }, 3000);

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Welcome to Eddy Madu's App
        </h1>
        <p className="text-lg sm:text-xl">
          {localStorage.getItem("token")
            ? "You are being redirected to your dashboard..."
            : "You are being redirected to the login page..."}
        </p>
        <p className="text-sm sm:text-base opacity-80">
          This is a responsive and fancy welcome page built by Eddy Madu.
        </p>
      </div>

      <div className="mt-8">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
