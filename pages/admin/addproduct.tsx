import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parse, serialize } from "cookie";
import { verifyToken, verifyTokenAdmin } from "../../lib/jsonwebtoken";
import { getUser } from "../../lib/models/User";
import Header from "../../lib/components/Header";
import Footer from "../../lib/components/Footer";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import { HiChevronDown } from "react-icons/hi";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;
  const cookies = parse(context.req.headers.cookie || '');
  const token = cookies.token;
  let response = null;
  let user = null;

  function convertUserIdToString(user: any): any {
    if (user && user._id) {
      return {
        ...user,
        _id: user._id.toString()
      };
    }
    return user;
  }

  if (!token || token == "") {
    return {
      redirect: {
        destination: '/user/login',
        permanent: false,
      },
    }
  } else {
    response = verifyTokenAdmin(token);


    if (response != null) {
      let parsedBody;
      if (typeof response === 'string') {
        parsedBody = JSON.parse(response);
      } else {
        parsedBody = response;
      }
      user = await getUser(parsedBody["email"])
      user = convertUserIdToString(user)
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

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      user: user,
      token: token
    }
  }
};



export default function account({ user, token }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["Selecione uma categoria"]));
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [quantity, setQuantity] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const photoPaths: string[] = [];
  const [files, setFiles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation("common");

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    const promises = files.map((file: any) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((base64Files: string[]) => {
      setFiles(base64Files);
    });
  };

  async function onSubmit(event: any) {
    event.preventDefault();

    if (title !== "" && description !== "" && price !== 0 && selectedKeys != new Set(["Selecione uma categoria"]) && files.length !== 0) {

      const selectedKeysArray = Array.from(selectedKeys);
      const selectedKeysString = selectedKeysArray.join(', ');

      const product = {
        token: token,
        name: title,
        description: description,
        price: price,
        brand: brand,
        category: selectedKeysString,
        quantity: Number(quantity),
        photo: files
      }


      const response2 = await fetch('/api/admin/addProduct', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      router.push('/user/account')
    } else {
      setErrorMessage("preencha todos os campos")
    }
  }

  return (
    <main className=" h-screen w-screen flex flex-col items-center">
      <Header />
      <div className="w-fit h-fit flex flex-col relative bg-white rounded-lg border border-gray-200 items-center">
        <div className="w-full h-px left-0 top-[86px] absolute bg-gray-200" />
        <div className="left-[48px] top-[32px] absolute text-gray-900 text-lg font-medium">{t("addproduct")}</div>
        <div className="flex flex-row justify-center items-center pt-24">
          <div className=" w-96 rounded-lg border-gray-200 justify-center flex flex-col items-center">
            <div className="text-zinc-600 text-sm font-medium leading-normal">{t("title")}</div>
            <input
              className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
              name={"name"} type={"text"} onChange={(e) => setTitle(e.target.value)} />
            <div className="text-zinc-600 text-sm font-medium leading-normal">{t("price")}</div>
            <input
              className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
              name={"preco"}
              type={"number"}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <div className="text-zinc-600 text-sm font-medium leading-normal">{t("description")}</div>
            <input
              className="w-80 h-32 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex mb-4"
              name={"descricao"} type={"text"} onChange={(e) => setDescription(e.target.value)} />
            <div className="text-zinc-600 text-sm font-medium leading-normal">{t("quantity")}</div>
            <input
              className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
              name={"quantity"} type={"number"} onChange={(e) => setQuantity(e.target.value)} />
            <div className="text-zinc-600 text-sm font-medium leading-normal">{t("brand")}</div>
            <input
              className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
              name={"brand"} type={"text"} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <div className=" items-center flex flex-col w-96">
            <div className="text-zinc-600 text-sm font-medium leading-normal">{t("image")}</div>
            <label
              className=" h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex mb-4 cursor-pointer bg-gray-900 text-white m"
              htmlFor="imagens">
              {t("selectimage")}
            </label>
            <input
              id="imagens"
              className="hidden"
              name={"imagens"} type={"file"} multiple onChange={handleFileChange} accept=".svg,.png,.jpg,.jpeg" />

            <Dropdown className="">
              <DropdownTrigger>
                <button className="bg-white-500 text-black flex flex-row items-center px-4 py-2 rounded border border-gray-200">
                  {selectedValue}
                  <HiChevronDown size={24} />
                </button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedKeys}
                onSelectionChange={(selection) => {
                  const stringSelection = new Set(Array.from(selection).map(String));
                  setSelectedKeys(stringSelection);
                }}
              >
                <DropdownItem key="Moda">Moda</DropdownItem>
                <DropdownItem key="Celulares">Celulares</DropdownItem>
                <DropdownItem key="Decoração">Decoração</DropdownItem>
                <DropdownItem key="Infantil">Infantil</DropdownItem>
                <DropdownItem key="Outros">Outros</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <button
          className="w-44 h-11 px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal mt-6 mb-6"
          type="submit" onClick={onSubmit}>{t("saveproduct")}
        </button>
        {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
        <div className="flex flex-row">
          {files.map((file, index) => (
            <div key={index} className="w-24 h-24 border border-gray-200 m-2">
              <img src={file} alt="preview" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );

}