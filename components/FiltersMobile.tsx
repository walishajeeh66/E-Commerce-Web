"use client";
import React, { useState } from "react";
import { IoFilter } from "react-icons/io5";
import Filters from "./Filters";

const FiltersMobile = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
        onClick={() => setOpen(true)}
      >
        <IoFilter className="text-lg" />
        Filters
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80%] overflow-auto rounded-t-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Filters</h3>
              <button
                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <Filters />
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersMobile;



