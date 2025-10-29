// *********************
// Role of the component: Wishlist item component for wishlist page
// Name of the component: WishItem.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <WishItem id={id} title={title} price={price} image={image} slug={slug} stockAvailabillity={stockAvailabillity} />
// Input parameters: ProductInWishlist interface
// Output: single wishlist item on the wishlist page
// *********************

"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { normalizeImageSrc } from "@/lib/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaHeartCrack } from "react-icons/fa6";
import { deleteWishItem } from "@/app/actions";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";

interface wishItemStateTrackers {
  setIsWishItemDeleted: any;
}

const WishItem = ({
  id,
  title,
  price,
  image,
  slug,
  stockAvailabillity,
}: ProductInWishlist) => {
  const { data: session, status } = useSession();
  const { removeFromWishlist } = useWishlistStore();
  const router = useRouter();
  const [userId, setUserId] = useState<string>();

  const openProduct = (slug: string): void => {
    router.push(`/product/${slug}`);
  };

  const getUserByEmail = useCallback(async () => {
    if (session?.user?.email) {
      apiClient.get(`/api/users/email/${session?.user?.email}`, {
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((data) => {
          setUserId(data?.id);
        });
    }
  }, [session?.user?.email]);

  const deleteItemFromWishlist = async (productId: string) => {
    if (userId) {
      apiClient.delete(`/api/wishlist/${userId}/${productId}`, {method: "DELETE"}).then(
        (response) => {
          removeFromWishlist(productId);
          toast.success("Item removed from your wishlist");
        }
      );
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email, getUserByEmail]);

  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <th
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {id}
      </th>
      <th>
        <div className="w-12 h-12 mx-auto" onClick={() => openProduct(slug)}>
          <Image
            src={normalizeImageSrc(image)}
            width={200}
            height={200}
            className="w-auto h-auto"
            alt={sanitize(title)}
          />
        </div>
      </th>
      <td
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {sanitize(title)}
      </td>
      <td
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {stockAvailabillity ? (
          <span className="text-success">In stock</span>
        ) : (
          <span className="text-error">Out of stock</span>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteItemFromWishlist(id)}
          className="btn btn-xs bg-blue-600 text-white hover:text-blue-600 border border-blue-600 hover:bg-white text-sm"
        >
          <FaHeartCrack />
          Remove
        </button>
      </td>
    </tr>
  );
};

export default WishItem;
