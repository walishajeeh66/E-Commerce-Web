"use client";
import { DashboardSidebar } from "@/components";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import apiClient from "@/lib/api";
import Image from "next/image";

const DashboardNewCategoryPage = () => {
  const [categoryInput, setCategoryInput] = useState({
    name: "",
    icon: "",
  });

  const uploadIcon = async (file: File) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await apiClient.post("/api/main-image", formData);
      if (response.ok) {
        const data = await response.json();
        setCategoryInput((prev) => ({ ...prev, icon: data?.filename || "" }));
        toast.success("Icon uploaded");
      } else {
        toast.error("Icon upload failed");
      }
    } catch (e) {
      toast.error("Icon upload error");
    }
  };

  const addNewCategory = () => {
    if (categoryInput.name.length > 0) {
      // sending API request for creating new cateogry
      apiClient.post(`/api/categories`, {
        name: convertCategoryNameToURLFriendly(categoryInput.name),
        icon: categoryInput.icon,
      })
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          } else {
            throw Error("There was an error while creating category");
          }
        })
        .then((data) => {
          toast.success("Category added successfully");
          setCategoryInput({
            name: "",
            icon: "",
          });
        })
        .catch((error) => {
          toast.error("There was an error while creating category");
        });
    } else {
      toast.error("You need to enter values to add a category");
    }
  };
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new category</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Category name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={categoryInput.name}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, name: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Category icon (upload image):</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadIcon(file);
              }}
            />
          </label>
          {categoryInput.icon && (
            <div className="mt-3">
              <span className="text-sm text-gray-600">Uploaded:</span>
              <div className="mt-1">
                <Image src={`/${categoryInput.icon}`} alt="icon preview" width={48} height={48} />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-x-2">
          <button
            type="button"
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
            onClick={addNewCategory}
          >
            Create category
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewCategoryPage;
