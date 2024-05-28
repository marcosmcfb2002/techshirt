import React, { useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import { LuPenLine, LuTrash2, LuCheck } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import { getProduct } from "../models/Product";

const columns = [
  { uid: "photo", name: "Foto" },
  { uid: "product", name: "Produto Pedido" },
  { uid: "date", name: "Data" },
  { uid: "price", name: "Preço Pago" },
  { uid: "status", name: "Status do Pedido" },
  { uid: "actions", name: "Ações" },
];

// const orders = [
//   {
//     id: 1,
//     product: "Produto 1",
//     date: "2023-05-20",
//     price: 29.99,
//     status: "Pendente",
//     photo: "https://via.placeholder.com/150",
//   },
//   {
//     id: 2,
//     product: "Produto 2",
//     date: "2023-05-21",
//     price: 59.99,
//     status: "Entregue",
//     photo: "https://via.placeholder.com/150",
//   },
// ];

// type Order = typeof orders[number];

function AdminOrdersTest(data: any) {

  const orders = data.orders
    const { t } = useTranslation("common");
  const renderCell = useCallback((order, columnKey: React.Key) => {
    const cellValue = order[columnKey];

    switch (columnKey) {
      case "photo":
        return <img src={String(cellValue)} alt="Order" className="h-16 w-16 object-cover rounded-md mx-auto mt-4" />;
      case "product":
        return <p className="text-center">{cellValue}</p>;
      case "date":
        return <p className="text-center">{cellValue}</p>;
      case "price":
        return <p className="text-center">R${cellValue}</p>;
      case "status":
        return <p className="text-center">{cellValue}</p>;
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Confirmar Entrega">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50 p-3 rounded-md hover:bg-black hover:text-white">
                <LuCheck />
              </span>
            </Tooltip>
            <Tooltip content="Editar Pedido">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50 p-3 rounded-md hover:bg-black hover:text-white">
                <LuPenLine />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Apagar Pedido">
              <span className="text-lg text-danger cursor-pointer active:opacity-50 p-3 rounded-md hover:bg-black hover:text-white">
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
          <h2 className="text-lg font-semibold ml-4 mt-4">{t("orders")}</h2>
          <div className="flex items-center">
            <div className="w-64 h-11 flex-col justify-center items-start inline-flex">
              <div className="self-stretch rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex">
                <button className={"ml-2"}>
                  <FaSearch size={18} />
                </button>
                <div className="text-gray-500 text-sm font-medium font-['Inter'] leading-normal">
                  <input type="text" name="Search" placeholder={t("search_orders")} className={"text-black w-52 h-8"} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Table aria-label="Tabela de pedidos">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className="border-t-2 border-b-2">
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={orders}>
            {(item:any) => (
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

export default AdminOrdersTest;
