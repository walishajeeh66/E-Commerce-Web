"use client";

// *********************
// Role of the component: Component that displays all orders on admin dashboard page
// Name of the component: AdminOrders.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <AdminOrders />
// Input parameters: No input parameters
// Output: Table with all orders
// *********************

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      // Get grouped orders with product lines and quantities
      const response = await apiClient.get("/api/order-product");
      const data = await response.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="xl:ml-5 w-full max-xl:mt-5 ">
      <h1 className="text-3xl font-semibold text-center mb-5">All orders</h1>
      <div className="overflow-x-auto">
        <table className="table table-md table-pin-cols">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Order ID</th>
              <th>Name and country</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
              {orders && orders.length > 0 &&
                orders.map((row) => (
                <tr key={row?.customerOrderId}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>

                  <td>
                    <div>
                      <p className="font-bold">#{row?.customerOrderId}</p>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-5">
                      <div>
                        <div className="font-bold">{row?.customerOrder?.name}</div>
                        <div className="text-sm opacity-50">{row?.customerOrder?.country}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {row?.products?.map((p:any) => `${p.title} x${p.quantity}`).join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-success text-white badge-sm">
                      {row?.customerOrder?.status}
                    </span>
                  </td>

                  <td>
                    <p>PKR {row?.customerOrder?.total}</p>
                  </td>

                  <td>{ new Date(Date.parse(row?.customerOrder?.dateTime)).toDateString() }</td>
                  <th>
                    <Link
                      href={`/admin/orders/${row?.customerOrderId}`}
                      className="btn btn-ghost btn-xs"
                    >
                      details
                    </Link>
                  </th>
                </tr>
              ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Order ID</th>
              <th>Name and country</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
