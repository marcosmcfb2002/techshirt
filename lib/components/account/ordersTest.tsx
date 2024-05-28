import React, { useState, useEffect } from 'react';
import { LuInbox, LuArrowRight } from "react-icons/lu";
import { CardOrder } from '../Card';
import { useTranslation } from "next-i18next";
import { Order } from '../../models/Order';
import { useRouter } from 'next/router';

interface OrdersTestProps {
  orders: Order[];
}

interface Product {
  title: string;
  date: Number;
  price: Number;
  imageUrl: string;
}

const OrdersTest: React.FC<OrdersTestProps> = ({ orders }) => {
  const { t } = useTranslation('common');

  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false); 
  const ordersList: Product[] = convertOrdersToProducts(orders);
  const router = useRouter();
  // [
  //   { title: "Card 1", date: "date 1", price: "$00,00", imageUrl: "https://via.placeholder.com/80"},
  //   { title: "Card 2", price: "$00,00", date: "date 2", imageUrl: "https://via.placeholder.com/80"},
  //   { title: "Card 3", price: "$00,00", date: "date 3", imageUrl: "https://via.placeholder.com/80"},
  // ];

  function convertOrdersToProducts(orders: Order[]): Product[] {
    return orders.map(order => ({
      title: order.status,
      date: order.requestDate,
      price: order.value,
      imageUrl: ''
    }));
  }

  useEffect(() => {
    setIsEmpty(ordersList.length === 0); 
  }, [ordersList]); 

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LuInbox size={64} /> 
        <p className="text-center mt-4 mb-6">{t("noOrders")}</p>
        <button
          className={`inline-flex items-center px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal transition-transform duration-300 transform ${isHovered ? 'scale-105' : ''}`}
          type="submit"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(event) => {
            event.preventDefault();
            router.push("/products?page=1");
          }}
        >
          <span>{t("startShopping")}</span>
          <span>
            <LuArrowRight size={22} strokeWidth={2}/>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="productTest">
      {ordersList.map((product, index) => (
        <CardOrder
          key={index}
          title={product.title}
          date={product.date.toString()}
          price={product.price.toString()}
          imageUrl={product.imageUrl} id={''} token={''}        />
      ))}
    </div>
  );
};

export default OrdersTest;
