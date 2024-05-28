import React, { useState, useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import { LuPenLine, LuTrash2, LuEye, LuPlus } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const columns = [
  { uid: "photo", name: "Foto" },
  { uid: "name", name: "Nome" },
  { uid: "price", name: "Preço" },
  { uid: "categories", name: "Categorias" },
  { uid: "actions", name: "Ações" },
];

// const products = [
//   {
//     id: 1,
//     name: "Produto 1",
//     price: 29.99,
//     quantity: 100,
//     categories: "Categoria A, Categoria B",
//     photo: "https://via.placeholder.com/150",
//   },
//   {
//     id: 2,
//     name: "Produto 2",
//     price: 59.99,
//     quantity: 50,
//     categories: "Categoria C",
//     photo: "https://via.placeholder.com/150",
//   }, ];

// type Product = typeof products[number];

function productCartTest(data: any) {
  const products = data.products || [];
  const { t } = useTranslation("common");
  const router = useRouter();
  const token = data.token

  const handleRemoveFromCart = async (productId: string) => {
    if (!(token == "")) {

      const json = {
        token: token,
        id: productId
      }

      const response = await fetch('/api/deleteProductInCart', {
        method: 'POST',
        body: JSON.stringify(json),
      })
      await router.push('/user/cart');
    } else {
      await router.push('/user/login');
    }
  };

  const handleViewProduct = async (productId: string) => {
      await router.push('/product/'+productId);
  };

  const renderCell = useCallback((product, columnKey: React.Key) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "photo":
        return <img src={String(cellValue)} alt="Product" className="h-16 w-16 object-cover rounded-md mx-auto mt-4" />;
      case "name":
        return <p className="text-center">{cellValue}</p>;
      case "price":
        return <p className="text-center">R${cellValue}</p>;
      case "quantity":
        return <p className="text-center">{cellValue}</p>;
      case "categories":
        return <p className="text-center">{cellValue}</p>;
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Detalhes">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50 p-3 rounded-md hover:bg-black hover:text-white" onClick={() => handleViewProduct(product.id)}>
                <LuEye />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Excluir do Carrinho">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50 p-3 rounded-md hover:bg-black hover:text-white"
                onClick={() => handleRemoveFromCart(product.id)}
              >
                <LuTrash2 />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="bg-gray-300 p-6 h-screen">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold ml-4 mt-4">{t("cart")}</h2>
        </div>
        <Table aria-label="Tabela do Carrinho">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className="border-t-2 border-b-2">
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={products}>
            {(item: any) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell className="text-center">{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default productCartTest;
