"use client";
import { DashboardSidebar, StatsElement } from "@/components";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { FaArrowUp } from "react-icons/fa6";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<{totalOrders:number;pendingOrders:number;deliveredOrders:number;cancelledOrders:number;totalRevenue:number;profit:number;visitorsToday:number}>({totalOrders:0,pendingOrders:0,deliveredOrders:0,cancelledOrders:0,totalRevenue:0,profit:0,visitorsToday:0});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/api/consolidated/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {}
    };
    load();
  }, []);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex flex-col items-center ml-5 gap-y-4 w-full max-xl:ml-0 max-xl:px-2 max-xl:mt-5 max-md:gap-y-1">
        <div className="grid grid-cols-3 gap-4 w-full max-md:grid-cols-1">
          <div className="w-full h-28 text-white rounded-none flex flex-col justify-center items-center" style={{backgroundImage:'linear-gradient(135deg,#1E396E,#35528A)'}}>
            <p className="text-lg">Total Orders</p>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="w-full h-28 bg-[color:var(--footer-dark,#373737)] text-white rounded-none flex flex-col justify-center items-center">
            <p className="text-lg">Pending / Delivered / Cancelled</p>
            <p className="text-xl font-semibold">{stats.pendingOrders} / {stats.deliveredOrders} / {stats.cancelledOrders}</p>
          </div>
          <div className="w-full h-28 text-white rounded-none flex flex-col justify-center items-center" style={{backgroundImage:'linear-gradient(135deg,#1E396E,#35528A)'}}>
            <p className="text-lg">Revenue / Profit</p>
            <p className="text-xl font-semibold">PKR {stats.totalRevenue} / PKR {stats.profit}</p>
          </div>
        </div>
        <div className="w-full text-white h-40 flex flex-col justify-center items-center gap-y-2 rounded-none" style={{backgroundImage:'linear-gradient(135deg,#1E396E,#35528A)'}}>
          <h4 className="text-3xl text-gray-100 max-[400px]:text-2xl">
            Number of visitors today
          </h4>
          <p className="text-3xl font-bold">{stats.visitorsToday}</p>
          <p className="text-green-300 flex gap-x-1 items-center">
            <FaArrowUp />
            12.5% Since last month
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
