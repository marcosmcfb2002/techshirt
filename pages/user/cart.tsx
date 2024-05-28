import {GetServerSidePropsContext} from "next";
import Header from "../../lib/components/Header";
import React, { useState } from "react";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Footer from "../../lib/components/Footer";
import { LuBox } from "react-icons/lu";
import { useTranslation } from "next-i18next";
import { parse } from "cookie";
import ProductCartTest from "../../lib/components/productCartTest";
import { verifyToken } from "../../lib/jsonwebtoken";
import { getUserByEmailComplety, updateUser, User } from "../../lib/models/User";
import { getProduct } from "../../lib/models/Product";

export type NewProduct = {
  id: string;
  name: string;
  price: number;
  categories: string;
  photo: string;
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const cookies = parse(context.req.headers.cookie || '');
  const token = cookies.token;
  const products: any[] = [];

  const convertProductsToProducts = (products: any[]): NewProduct[] => {
    return products
      .filter(product => product !== null)
      .map(product => ({
        id: product._id?.toString() || '',
        name: product.name,
        price: product.price,
        categories: product.category,
        photo: product.photo[0] || "https://via.placeholder.com/150",
      }));
  };

  if (token || token != "" && token || token != undefined && token) {
    const descryptToken = verifyToken(token);
    if (descryptToken) {
      const user = await getUserByEmailComplety(descryptToken.email);
      for (const productId of user?.cart) {
        const product = await getProduct(productId);
        if (product) {
          products.push(product);
        } else {
          const index = user?.cart.indexOf(productId);
          if (index > -1) {
            user?.cart.splice(index, 1);
          }
          if (user){
            const updatedCart: User = {
              _id: user._id,
              name: user.name,
              lastName: user.lastName,
              email: user.email,
              password: user.password,
              cpf: user.cpf,
              phone: user.phone,
              address: user.address,
              cart: user.cart,
              wishList: user.wishList
            };
          await updateUser(updatedCart);
        }
      }
      }
    }
  }

  return {
      props: {
          ...(await serverSideTranslations(context.locale!, ['common'])),
          products: convertProductsToProducts(products),
          token: token
      }
  }
};
export default function cart(data: any) {
  const { t } = useTranslation("common");
  const [pressedButton, setPressedButton] = useState("products");
  const [activeSection, setActiveSection] = useState("products");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "products":
        return (
          <figure className="w-full content-center">
            <ProductCartTest products={data.products} token={data.token} />
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
                {t('cart')}
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