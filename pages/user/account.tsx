import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Header from "../../lib/components/Header";
import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parse, serialize } from "cookie";
import { verifyToken } from "../../lib/jsonwebtoken";
import { getUserByEmailComplety } from "../../lib/models/User";
import Footer from "../../lib/components/Footer";
import {
  LuHeart,
  LuKeyRound,
  LuLogOut,
  LuShoppingCart,
  LuTruck,
  LuUserCircle2,
} from "react-icons/lu";
import { useTranslation } from "next-i18next";
import OrdersTest from "../../lib/components/account/ordersTest";
import WishlistTest from "../../lib/components/account/wishListTest";
import Popup from "../../lib/components/Popup";
import { useRouter } from "next/router";
import { getOrder, Order } from "../../lib/models/Order";
import { getProduct } from "../../lib/models/Product";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req, res } = context;
  const cookies = parse(context.req.headers.cookie || "");
  const token = cookies.token;
  let response = null;
  let user = null;
  let orders: Order[] = [];
  let wishList: any[] = []

  if (!token || token == "") {
    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      },
    };
  } else {
    response = verifyToken(token);

    if (response != null) {
      let parsedBody;
      if (typeof response === "string") {
        parsedBody = JSON.parse(response);
      } else {
        parsedBody = response;
      }
      user = await getUserByEmailComplety(parsedBody["email"]);
      if (user?._id) {
        orders = await getOrder(user._id.toString());
        orders = convertOrdersIdToString(orders);
        wishList = user.wishList;
        if (wishList) {
          wishList = await Promise.all(wishList.map(productId => getProduct(productId)));
          wishList = convertProductIdToString(wishList);
        } else {
          wishList = [];
        }
      }
      delete (user as { _id?: any })._id;
    } else {
      res.setHeader('Set-Cookie', serialize('token', "", {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development', // secure in production
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      }));
      return {
        redirect: {
          destination: '/user/login',
          permanent: false,
        }
      }
    }
  }

  function convertOrdersIdToString(orders: Order[]): any[] {
    return orders.map((order) => ({
      ...order,
      _id: order._id ? order._id.toString() : null,
      idUser: order.idUser ? order.idUser.toString() : null,
      idPayment: order.idPayment ? order.idPayment.toString() : null,
    }));
  }

  function convertProductIdToString(product: any[]): any[] {
    return product.map((product) => ({
      ...product,
      _id: product._id ? product._id.toString() : null
    }));
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ["common"])),
      user: user,
      token: token,
      orders: orders,
      wishList: wishList,
    },
  };
};

export default function account({
  user,
  token,
  orders,
  wishList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");
  const [pressedButton, setPressedButton] = useState("orders");
  const [activeSection, setActiveSection] = useState("orders");
  const [isShowPopup, setIsShowPopup] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const togglePopup = () => {
    setIsShowPopup(!isShowPopup);
  };

  const sendNewPassword = () => {
    if (password == confirmPassword) {
      const json = {
        token: token,
        password: password,
      };
      const response = fetch("/api/updatePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      });
      document.cookie = serialize("token", "", {
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV !== "development", // secure in production
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      router.push("/user/login");
    } else {
      setErrorMessage(t("passwordsAreNotTheSame"));
    }
  };

  if (user != null) {
    const renderActiveSection = () => {
      switch (activeSection) {
        case "orders":
          return (
            <figure className="w-full content-center">
              <form className="flex flex-col space-y-4 p-4">
                <div className="text-gray-900 text-base font-semibold font-['Inter']">
                  {t("myOrders")}
                </div>
                <OrdersTest orders={orders} />
              </form>
            </figure>
          );

        case "wishlist":
          return (
            <figure className="w-full content-center">
              <form className="flex flex-col space-y-4 p-4">
                <div className="text-gray-900 text-base font-semibold font-['Inter']">
                  {t("myWishlist")}
                </div>
                <WishlistTest wishList={wishList} token={token} />
              </form>
            </figure>
          );
        case "address":
          return (
            <figure className="w-full content-center flex flex-row items-center ">
              <div>
                <form className={"flex flex-col space-y-4 p-4 w-fit "}>
                  <div className="text-gray-900 text-base font-semibold font-['Inter']">
                    {t("shippingAddress")}
                  </div>
                  <div className="text-zinc-600 text-sm font-medium leading-normal">
                    {t("address")}
                  </div>
                  <input
                    className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                    name={"street"}
                    type={"text"}
                    defaultValue={user.address.street}
                  />
                  <div className="text-zinc-600 text-sm font-medium leading-normal">
                    {t("city")}
                  </div>
                  <input
                    className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                    name={"city"}
                    type={"text"}
                    defaultValue={user.address.city}
                  />
                  <div className="text-zinc-600 text-sm font-medium leading-normal">
                    {t("zipCode")}
                  </div>
                  <input
                    className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                    name={"zipCode"}
                    type={"text"}
                  />
                  <button
                    className="w-44 h-11 px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal"
                    type="submit"
                  >
                    {t("saveChanges")}
                  </button>
                </form>
              </div>
              <div className="pb-28 ">
                <form className={"flex flex-col space-y-4 p-4 w-fit"}>
                  <div className="text-zinc-600 text-sm font-medium leading-normal ">
                    {t("state")}
                  </div>
                  <input
                    className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                    name={"state"}
                    type={"text"}
                    defaultValue={user.address.state}
                  />
                  <div className="text-zinc-600 text-sm font-medium leading-normal">
                    {t("country")}
                  </div>
                  <input
                    className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                    name={"country"}
                    type={"text"}
                    defaultValue={user.address.country}
                  />
                </form>
              </div>
            </figure>
          );
        case "password":
          return (
            <figure className="w-full content-center p-1">
              <div>
                <form className={"flex flex-col space-y-4 p-4 w-fit "}>
                  <div className="text-gray-900 text-base font-semibold font-['Inter']">
                    {t("redefinePassword")}
                    <div className="text-zinc-600 text-sm font-medium leading-normal mt-4">
                      {t("newPassword")}
                    </div>
                    <input
                      className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                      name={"password"}
                      type={"password"}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="text-zinc-600 text-sm font-medium leading-normal mt-4">
                      {t("confirmPassword")}
                    </div>
                    <input
                      className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                      name={"confirmPassword"}
                      type={"password"}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errorMessage && (
                      <p className="text-red-500 text-xs">{errorMessage}</p>
                    )}
                    <div className="w-full content-center mt-4">
                      <button
                        className="w-44 h-11 px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm  leading-normal font-semibold font-['Inter'] "
                        type="submit"
                        onClick={(event) => {
                          event.preventDefault();
                          sendNewPassword();
                        }}
                      >
                        {t("saveChanges")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </figure>
          );
        case "account detail":
          return (
            <figure className={"w-full content-center"}>
              <form className={"flex flex-col space-y-4 p-4"}>
                <div className="text-gray-900 text-base font-semibold font-['Inter']">
                  {t("accountDetails")}
                </div>
                <div className="text-zinc-600 text-sm font-medium leading-normal">
                  {t("name")}
                </div>
                <input
                  className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                  name={"name"}
                  type={"text"}
                  defaultValue={user.name}
                />
                <div className="text-zinc-600 text-sm font-medium leading-normal">
                  {t("email")}
                </div>
                <input
                  className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                  name={"email"}
                  type={"email"}
                  defaultValue={user.email}
                />
                <button
                  className="w-44 h-11 px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal"
                  type="submit"
                >
                  {t("saveChanges")}
                </button>
              </form>
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
            {isShowPopup && <Popup togglePopup={togglePopup} />}
            <section className="flex-col justify-start items-end gap-4 inline-flex border-2 border-r-gray-200 border-t-white border-b-white border-l-white pr-2">
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
                  pressedButton === "wishlist" ? "bg-neutral-100" : ""
                }`}
                onClick={() => {
                  setPressedButton("wishlist");
                  setActiveSection("wishlist");
                }}
              >
                <LuHeart />
                <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                  {t("wishlist")}
                </div>
              </button>
              <button
                className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${
                  pressedButton === "address" ? "bg-neutral-100" : ""
                }`}
                onClick={() => {
                  setPressedButton("address");
                  setActiveSection("address");
                }}
              >
                <LuTruck />
                <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                  {t("address")}
                </div>
              </button>
              <button
                className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${
                  pressedButton === "password" ? "bg-neutral-100" : ""
                }`}
                onClick={() => {
                  setPressedButton("password");
                  setActiveSection("password");
                }}
              >
                <LuKeyRound />
                <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                  {t("password")}
                </div>
              </button>
              <button
                className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${
                  pressedButton === "account detail" ? "bg-neutral-100" : ""
                }`}
                onClick={() => {
                  setPressedButton("account detail");
                  setActiveSection("account detail");
                }}
              >
                <LuUserCircle2 />
                <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                  {t("accountDetails")}
                </div>
              </button>
              <button
                className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${
                  pressedButton === "logout" ? "bg-neutral-100" : ""
                }`}
                onClick={() => {
                  togglePopup();
                }}
              >
                <LuLogOut />
                <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                  Logout
                </div>
              </button>
            </section>
            {renderActiveSection()}
          </main>
        </section>
        <Footer />
      </main>
    );
  } else {
    return <a>erro</a>;
  }
}
