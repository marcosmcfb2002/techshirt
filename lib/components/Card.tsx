import React, { useState } from 'react';
import { useTranslation } from "next-i18next";

interface CardProps {
  title: string;
  date: string;
  price: string;
  imageUrl: string;
  id: string;
  token: string;
}

const CardOrder: React.FC<CardProps> = ({ title = "Default Title", date = "Default Date", price = "$00,00", imageUrl = "https://via.placeholder.com/80" }) => {
  const { t } = useTranslation('common');
  return (
    <div className="bg-white rounded-lg p-4 flex items-center">
      {/* <img src={imageUrl} alt={title} className="w-24 h-24 object-cover rounded-lg" /> */}
      <div className="flex w-fit justify-between ml-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600"> {t("orderedOn")} {date}</p>
          <p className="text-gray-600">R${price}</p>
        </div>
        <div className="flex items-center">
          <p className="text-gray-600 ml-28 mr-6">
            {/* Seu texto aqui */}
          </p>
          {/* <button className="border border-gray-800 hover:bg-gray-800 hover:text-white bg-white-800 font-semibold text-black px-4 py-2 rounded-md">{t("viewItem")}</button> */}
        </div>
      </div>
    </div>
  );
};

async function removeFromWishlist(token: string, productId: string) {
  const response = await fetch('/api/removeFromWishList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token, productId: productId }),
  });

  return response.json();
}

async function addInCart(token: string, productId: string) {
  const response = await fetch('/api/addProductInCart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token, id: productId }),
  });

  await removeFromWishlist(token,productId)

  return response.json();
}

const CardWishlist: React.FC<CardProps> = ({ title = "Default Title", date = "Default Date", price = "$00,00", imageUrl = "https://via.placeholder.com/80", id, token }) => {
  const { t } = useTranslation('common');
  const [isVisible, setIsVisible] = useState(true);
  return isVisible ? (
    <div className="bg-white rounded-lg p-4 flex items-center">
      <img src={imageUrl} alt={title} className="w-24 h-24 object-cover rounded-lg" />
      <div className="flex w-fit justify-between ml-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600">{t("brand") + ": " + date}</p>
          <p className="text-gray-600">R${price}</p>
        </div>
        <div className="flex items-center">
          <button className="border border-gray-800 hover:bg-gray-800 hover:text-white bg-white-800 font-semibold text-black px-4 py-2 rounded-md ml-16 mr-4" onClick={async (event) => {
            event.preventDefault();
            await addInCart(token, id);
            setIsVisible(false);
          }}>{t("addToCart")}</button>
          <button className="border border-gray-800 hover:bg-gray-800 hover:text-white bg-white-800 font-semibold text-black px-4 py-2 rounded-md" onClick={async (event) => {
            event.preventDefault();
            await removeFromWishlist(token, id);
            setIsVisible(false);
          }}>{t("removeItem")}</button>
        </div>
      </div>
    </div>
  ) : null;
}




export { CardOrder, CardWishlist, };

