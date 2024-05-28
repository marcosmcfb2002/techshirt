import React, { useState, useEffect } from 'react';
import { LuInbox, LuArrowRight } from "react-icons/lu";
import { CardWishlist } from '../Card';
import { useTranslation } from "next-i18next";
import { useRouter } from 'next/router';

interface WishListTestProps {
  wishList: string[];
  token: string;
}

interface Product {
  title: string;
  date: string;
  price: string;
  imageUrl: string;
}

const WishlistTest: React.FC<WishListTestProps> = ({ wishList, token }) => {

  const { t } = useTranslation('common');
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchWishlistItems = async () => {
      setWishlistItems(wishList);
    };

    fetchWishlistItems();
  }, [wishList]);

  useEffect(() => {
    setIsEmpty(wishlistItems.length === 0);
  }, [wishlistItems]);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LuInbox size={64} />
        <p className="text-center mt-4 mb-6">{t("noWishList")}</p>
        <button
          className={`inline-flex items-center px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal transition-transform duration-300 transform ${isHovered ? 'scale-105' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(event) => {
            event.preventDefault();
            router.push("/products?page=1");
          }}
        >
          <span>{t("startAdding")}</span>
          <span>
            <LuArrowRight size={22} strokeWidth={2} />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="wishlist">
      {wishlistItems.map((item, index) => (
        <CardWishlist
          key={index}
          title={item.name}
          date={item.brand}
          price={item.price}
          imageUrl={item.photo}
          id={item._id}
          token={token}
        />
      ))}
    </div>
  );
};

export default WishlistTest;
