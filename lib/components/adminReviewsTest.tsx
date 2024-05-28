import React, { useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import { LuEye, LuTrash2 } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "next-i18next";

const columns = [
  { uid: "photo", name: "Foto" },
  { uid: "name", name: "Nome" },
  { uid: "rating", name: "Nota" },
  { uid: "review", name: "Avaliação" },
  { uid: "actions", name: "Ações" },
];

// const reviews = [
//   {
//     id: 1,
//     name: "Cliente 1",
//     rating: 4.5,
//     review: "Ótimo produto!",
//     photo: "https://via.placeholder.com/150",
//   },
//   {
//     id: 2,
//     name: "Cliente 2",
//     rating: 3,
//     review: "Produto razoável.",
//     photo: "https://via.placeholder.com/150",
//   },
// ];

// type Review = typeof reviews[number];

function AdminReviewsTest(data:any) {
  const reviews = data.assessments
    const { t } = useTranslation("common");
  const renderCell = useCallback((review, columnKey: React.Key) => {
    const cellValue = review[columnKey];

    switch (columnKey) {
      case "photo":
        return <img src={String(cellValue)} alt="Review" className="h-16 w-16 object-cover rounded-md mx-auto mt-4" />;
      case "name":
        return <p className="text-center">{cellValue}</p>;
      case "rating":
        return <p className="text-center">{cellValue}</p>;
      case "review":
        return <p className="text-center">{cellValue}</p>;
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Ver Produto Avaliado">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50 p-3 rounded-md hover:bg-black hover:text-white">
                <LuEye />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Apagar Avaliação">
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
          <h2 className="text-lg font-semibold ml-4 mt-4">{t("reviews")}</h2>
          <div className="flex items-center">
            <div className="w-64 h-11 flex-col justify-center items-start inline-flex">
              <div className="self-stretch rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex">
                <button className={"ml-2"}>
                  <FaSearch size={18} />
                </button>
                <div className="text-gray-500 text-sm font-medium font-['Inter'] leading-normal">
                  <input type="text" name="Search" placeholder={t("search_reviews")} className={"text-black w-52 h-8"} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Table aria-label="Tabela de avaliações">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className="border-t-2 border-b-2">
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={reviews}>
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

export default AdminReviewsTest;
