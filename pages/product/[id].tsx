import { useRouter } from "next/router";
import React, { useState, FormEvent } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "node:querystring";
import Header from "../../lib/components/Header";
import { useTranslation } from "next-i18next";
import Footer from "../../lib/components/Footer";
import { getProduct, Product } from "../../lib/models/Product";
import { Card, CardBody, cn, PaginationItemType, Switch, Tab, Tabs, usePagination } from "@nextui-org/react";
import { ChevronIcon } from "../../lib/components/ChevronIcon";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LuHeart, LuHeartOff, LuPlus, LuMinus } from "react-icons/lu";
import { parse } from "cookie";
import { verifyToken } from "../../lib/jsonwebtoken";

interface ProductWithIdString extends Omit<Product, '_id'> {
  _id: string;
  quantity: number;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = parse(context.req.headers.cookie || '');
  let token = cookies.token;
  const parsedUrlQuery: ParsedUrlQuery = context.query;
  const productId: string | string[] | undefined = parsedUrlQuery["id"];
  let productWithIdString: ProductWithIdString | undefined;

  if (token && !(verifyToken(token))) {
    token = "";
  }

  if (typeof productId === "string") {
    const product = await getProduct(productId);
    if (product) {
      productWithIdString = {
        ...product,
        _id: product._id?.toString(),
        quantity: product.quantity,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        photo: product.photo,
      };
    }
  }

  if (productWithIdString) {
    return {
      props: {
        ...(await serverSideTranslations(context.locale!, ["common"])),
        product: productWithIdString,
        productId: productWithIdString._id,
        token: token || null,
      },
    };
  }
  return { notFound: true };
};

export default function ProductPage({
  product,
  productId,
  token
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [error, setError] = useState("");
  const { t } = useTranslation("common");
  const isVertical = true;

  const [quantity, setQuantity] = useState(1);
  const [isHeartClicked, setIsHeartClicked] = useState(false);

  const incrementQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const { activePage, range, setPage, onNext, onPrevious } = usePagination({
    total: product.photo.length,
    showControls: true,
    siblings: 10,
    boundaries: 10,
  });

  async function addToCart() {
    if (!(token == "")) {
      for (let i = 0; i < quantity; i++) {
        const json = {
          token: token,
          id: productId
        }

        const response = await fetch('/api/addProductInCart', {
          method: 'POST',
          body: JSON.stringify(json),
        })
      }
      await router.push('/user/cart');
    } else {
      await router.push('/user/login');
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-4 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <img
            className="w-full max-w-xs h-auto rounded-lg shadow-md"
            src={product.photo[activePage - 1]}
            alt={product.name}
          />
          <div className="flex space-x-2 mt-4">
            {range.map((page) => {
              if (page === PaginationItemType.NEXT) {
                return (
                  <button
                    key={page}
                    aria-label="next page"
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                    onClick={onNext}
                  >
                    <ChevronIcon className="rotate-180" />
                  </button>
                );
              }
              if (page === PaginationItemType.PREV) {
                return (
                  <button
                    key={page}
                    aria-label="previous page"
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                    onClick={onPrevious}
                  >
                    <ChevronIcon />
                  </button>
                );
              }
              if (page === PaginationItemType.DOTS) {
                return (
                  <div
                    key={page}
                    className="w-8 h-8 flex items-center justify-center"
                  >
                    ...
                  </div>
                );
              }
              return (
                <button
                  key={page}
                  aria-label={`page ${page}`}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${activePage === page ? "bg-gray-800 text-white" : "bg-gray-200"
                    }`}
                  onClick={() => setPage(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-8 border-2 border-gray-300 rounded-md p-3">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-lg font-bold text-gray-600">
            {"R$" + product.price.toFixed(2)}
          </p>
          <div className="flex items-center space-x-4">
            <label className="text-md font-medium text-gray-600">
              {t("Quantity")}
            </label>
          </div>
          <div className="flex items-start justify-start border border-gray-300 rounded-md p-1" style={{ maxWidth: "164px" }}>
            <button
              className="w-8 h-11 flex items-center justify-center rounded-l-md border-r border-gray-300"
              onClick={decrementQuantity}
            >
              <LuMinus size={18} />
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 border-0 p-2 focus:outline-none"
            />
            <button
              className="w-8 h-11 flex items-center justify-center rounded-r-md border-l border-gray-300"
              onClick={incrementQuantity}
            >
              <LuPlus size={18} />
            </button>
          </div>
          <div className="flex space-x-4">
            <button className="w-full md:w-auto bg-gray-900 text-white text-sm font-medium rounded-md p-3" onClick={addToCart}>
              {t("addToCart")}
            </button>
            <button
              className="w-12 h-12 flex items-center justify-center rounded-md border border-gray-300 transition-colors duration-400 ease-in-out"
              onClick={() => setIsHeartClicked(!isHeartClicked)}
            >
              {isHeartClicked ? (
                <LuHeart size={24} style={{ color: "black" }} />
              ) : (
                <LuHeartOff size={24} style={{ color: "gray" }} />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-4">
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" isVertical={isVertical}>
            <Tab key="details" title={t("Details")}>
              <Card>
                <CardBody>
                  <h2 className="text-xl font-semibold mb-4">{t("Details")}</h2>
                  {product.description}
                </CardBody>
              </Card>
            </Tab>
            <Tab key="reviews" title={t("reviews")}>
              <Card>
                <CardBody>
                  <h2 className="text-xl font-semibold mb-4">{t("reviews")}</h2>
                  {product.assessments}
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
      <Footer />
    </main>
  );
}