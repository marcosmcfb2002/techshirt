import Header from "../../lib/components/Header";
import React, { useState } from "react";
import Footer from "../../lib/components/Footer";
import {
  LuShoppingCart,
  LuUsers,
  LuStar,
  LuBox,
} from "react-icons/lu";
import { useTranslation } from "next-i18next";
import AdminProductsTest from "../../lib/components/adminProductsTest";
import AdminOrdersTest from "../../lib/components/adminOrdersTest";
import AdminCustomersTest from "../../lib/components/adminCustomersTest";
import AdminReviewsTest from "../../lib/components/adminReviewsTest";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";
import { parse } from "cookie";
import { verifyTokenAdmin } from "../../lib/jsonwebtoken";
import { getEveryAssessments, getEveryProducts, getProduct } from "../../lib/models/Product";
import { getEveryOrder } from "../../lib/models/Order";
import { getEveryUsers, getUserByIDComplety } from "../../lib/models/User";

export type NewOrder = {
  id: string;
  product: string;
  date: string;
  price: number;
  status: string;
  photo: string;
};

export type NewProduct = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categories: string;
  photo: string;
};


export const getServerSideProps = async (context: GetServerSidePropsContext) => {

  const convertAssessmentsToAssessments = async (assessments: any[]) => {
    return Promise.all(assessments.map(async assessment => {
      const user = await getUserByIDComplety(assessment.idUser);
      return {
        id: "",
        name: user?.name || '',
        rating: assessment.note || 0,
        review: assessment.assessment || '', // fornecendo um valor padrão
        photo: "https://via.placeholder.com/150",
      };
    }));
  };

  const convertProductsToProducts = (products: any[]): NewProduct[] => {
    return products.map(product => ({
      id: product._id?.toString() || '',
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      categories: product.category,
      photo: product.photo[0] || "https://via.placeholder.com/150",
    }));
  };

  const convertOrdersToOrders = async (orders: any[]): Promise<NewOrder[]> => {
    return Promise.all(orders.map(async order => {
      const productNames = await Promise.all(order.productList.map(getProduct));
      const productNamesString = productNames.filter(product => product).map(product => product.name).join(', ');
  
      return {
        id: order._id?.toString() || '',
        product: productNamesString,
        date: new Date(order.requestDate).toISOString().split('T')[0],
        price: order.value,
        status: order.status,
        photo: "https://via.placeholder.com/150",
      };
    }));
  };

  const cookies = parse(context.req.headers.cookie || '');
  const token = cookies.token;
  let products;
  let orders;
  let assessments;
  let users;

  if (token || token != "" && token || token != undefined && token) {

    const email = await verifyTokenAdmin(token)
    if (email){
      products = (await getEveryProducts()).map(product => ({ ...product, _id: product._id.toString() }))
      orders = (await getEveryOrder()).map(order => ({ 
        ...order, 
        _id: order._id.toString(), 
        idPayment: order.idPayment?.toString() 
      }))
      assessments = (await getEveryAssessments())
      users = (await getEveryUsers()).map(user => ({ ...user, _id: user._id.toString() }));
      return {
        props: {
            ...(await serverSideTranslations(context.locale!, ['common'])),
            products: convertProductsToProducts(products),
            orders: await convertOrdersToOrders(orders),
            assessments: await convertAssessmentsToAssessments(assessments),
            users:users,
            token:token
        }
    }
    } else {
      return {notFound: true}
    }
  } else {
    return {notFound: true}
  }
};

export default function admin(data: any) {
  const { t } = useTranslation("common");
  const [pressedButton, setPressedButton] = useState("products");
  const [activeSection, setActiveSection] = useState("products");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "products":
        return (
          <figure className="w-full content-center">
            <AdminProductsTest products={data.products} token={data.token}/>
          </figure>
        );
      case "orders":
        return (
          <figure className="w-full content-center">
            <AdminOrdersTest orders={data.orders} token={data.token}/>
          </figure>
        );
      case "clients":
        return (
          <figure className="w-full content-center">
            <AdminCustomersTest users={data.users} token={data.token}/>
          </figure>
        );
      case "reviews":
        return (
          <figure className="w-full content-center">
           <AdminReviewsTest assessments={data.assessments} token={data.token}/>
          </figure>
        );
      default:
        return null;
    }
  };

  return (
    <main className="h-screen">
      <Header />
      <section className="content-center h-full ml-10">
        <main className="flex">
          <section className="flex-col justify-start items-end gap-4 inline-flex border-2 border-r-gray-200 border-t-white border-b-white border-l-white pr-2">
            <button
              className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${
                pressedButton === "products" ? "bg-neutral-100" : ""
              }`}
              onClick={() => {
                setPressedButton("products");
                setActiveSection("products");
              }}
            >
              <LuBox />
              <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                {t("products")}
              </div>
            </button>
            <button
              className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${
                pressedButton === "orders" ? "bg-neutral-100" : ""
              }`}
              onClick={() => {
                setPressedButton("orders");
                setActiveSection("orders");
              }}
            >
              <LuShoppingCart />
              <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                {t("orders")}
              </div>
            </button>
            <button
              className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${
                pressedButton === "clients" ? "bg-neutral-100" : ""
              }`}
              onClick={() => {
                setPressedButton("clients");
                setActiveSection("clients");
              }}
            >
              <LuUsers />
              <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                {t("customers")}
              </div>
            </button>
            <button
              className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${
                pressedButton === "reviews" ? "bg-neutral-100" : ""
              }`}
              onClick={() => {
                setPressedButton("reviews");
                setActiveSection("reviews");
              }}
            >
              <LuStar />
              <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                {t("reviews")}
              </div>
            </button>
          </section>
          {renderActiveSection()}
        </main>
      </section>
      <Footer />
    </main>
  );
}
