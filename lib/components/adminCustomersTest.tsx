import React, { useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import { LuPenLine, LuTrash2 } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "next-i18next";

const columns = [
  { uid: "photo", name: "Foto" },
  { uid: "name", name: "Nome" },
  { uid: "email", name: "Email" },
  { uid: "address", name: "Endereço" },
  { uid: "actions", name: "Ações" },
];

// const customers = [
//   {
//     id: 1,
//     name: "Cliente 1",
//     email: "cliente1@example.com",
//     address: "Rua A, 123",
//     photo: "https://via.placeholder.com/150",
//   },
//   {
//     id: 2,
//     name: "Cliente 2",
//     email: "cliente2@example.com",
//     address: "Rua B, 456",
//     photo: "https://via.placeholder.com/150",
//   },
// ];

// type Customer = typeof customers[number];

function AdminCustomersTest(data: any) {
  const users = data.users
  const convertUsersToCustomers = (users: any) => {
    return users.map((user: {
      photo: any; _id: { toString: () => any; }; name: any; lastName: any; email: any; address: { street: any; number: any; };
    }) => ({
      id: user._id?.toString() || '',
      name: `${user.name} ${user.lastName}`,
      email: user.email,
      address: `${user.address.street}, ${user.address.number}`,
      photo: "https://via.placeholder.com/150",
    }));
  };

  const customers = convertUsersToCustomers(users);
  const { t } = useTranslation("common");
  const renderCell = useCallback((customer, columnKey: React.Key) => {
    const cellValue = customer[columnKey];

    switch (columnKey) {
      case "photo":
        return <img src={String(cellValue)} alt="Customer" className="h-16 w-16 object-cover rounded-md mx-auto mt-4" />;
      case "name":
        return <p className="text-center">{cellValue}</p>;
      case "email":
        return <p className="text-center">{cellValue}</p>;
      case "address":
        return <p className="text-center">{cellValue}</p>;
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Editar Informações">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50 p-3 rounded-md hover:bg-black hover:text-white">
                <LuPenLine />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Deletar Cliente">
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
          <h2 className="text-lg font-semibold ml-4 mt-4">{t("customers")}</h2>
          <div className="flex items-center">
            <div className="w-64 h-11 flex-col justify-center items-start inline-flex">
              <div className="self-stretch rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex">
                <button className={"ml-2"}>
                  <FaSearch size={18} />
                </button>
                <div className="text-gray-500 text-sm font-medium font-['Inter'] leading-normal">
                  <input type="text" name="Search" placeholder={t("search_customers")} className={"text-black w-52 h-8"} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Table aria-label="Tabela de clientes">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className="border-t-2 border-b-2">
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={customers}>
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

export default AdminCustomersTest;
