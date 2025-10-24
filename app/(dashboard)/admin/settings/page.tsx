"use client";
import { DashboardSidebar } from "@/components";
import React from "react";

const AdminSettingsPage = () => {
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <div className="rounded-none border border-gray-200 p-5">
          <p className="text-gray-700">General settings will go here.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;


