// *********************
// Role of the component: Pagination for navigating the shop page
// Name of the component: Pagination.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <Pagination />
// Input parameters: no input parameters
// Output: Component with the current page and buttons for incrementing and decrementing page
// *********************

"use client";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import React from "react";

const Pagination = () => {
  // getting from Zustand store current page and methods for incrementing and decrementing current page
  const { page, incrementPage, decrementPage } = usePaginationStore();
  return (
    <div className="flex items-center justify-center gap-2 py-10">
      <button
        className="h-10 min-w-10 rounded-md border border-gray-300 px-3 text-sm text-gray-700 hover:bg-blue-soft"
        onClick={() => decrementPage()}
      >
        Prev
      </button>
      <span className="h-10 min-w-10 rounded-md px-3 text-sm font-semibold leading-10 text-center text-white" style={{backgroundImage:'linear-gradient(135deg,#1E396E,#35528A)'}}>
        {page}
      </span>
      <button
        className="h-10 min-w-10 rounded-md border border-gray-300 px-3 text-sm text-gray-700 hover:bg-blue-soft"
        onClick={() => incrementPage()}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
