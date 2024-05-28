import Image from "next/image";
import { FaSearch, FaUser } from "react-icons/fa";
import { LuShoppingCart, LuUserCircle2 } from "react-icons/lu";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from 'next-i18next';
import { useRouter } from "next/router";
import { IoSearch } from "react-icons/io5";

const header = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');

    function handleSearch() {
        let encodedInputValue = encodeURIComponent(inputValue);
        router.push("/products?page=1&text=" + encodedInputValue);
    }

    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputValue(event.target.value);
    };
    return (
        <header>
            <div className="py-5 bg-white justify-center items-center flex">
                <div className={"justify-center items-center"}>
                    <div className="justify-start items-center gap-3 flex mr-24">
                        <div
                            className="w-10 h-10 bg-gray-900 bg-opacity-0 rounded-full justify-center items-center gap-2.5 flex">
                            <Image src={"/logo.png"} width={64} height={64} alt={"Logo"}></Image>
                        </div>
                        <div>
                            <span className={"text-green-500 text-xl font-extrabold capitalize"}>Tech</span>
                            <span className={"text-black-900 text-xl font-extrabold capitalize"}>Shirt</span>
                        </div>
                    </div>
                </div>
                <div className="justify-start items-center gap-8 flex">
                    <Link className="text-gray-600 text-sm font-medium leading-normal" href={"/"}>{t('home')}</Link>
                    <div className="justify-center items-center gap-2 flex">
                        <Link className="text-gray-600 text-sm font-medium leading-normal" href={"/products?page=1"}>{t('products')}</Link>
                    </div>
                    <Link className="text-gray-600 text-sm font-medium leading-normal" href={"/about"}>{t('about')}</Link>
                    <Link className="text-gray-600 text-sm font-medium leading-normal" href={"/contact"}>{t('contact')}</Link>
                </div>
                <div className="w-64 h-11 flex-col justify-center items-start inline-flex ml-48">
                    <div
                        className="self-stretch rounded-md border-gray-200 justify-start items-center gap-2 inline-flex">
                            <button onClick={handleSearch}>
                                <IoSearch size={24} />
                            </button>
                            <input
                                type="text"
                                className="border rounded p-2"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                    </div>
                </div>
                <Link href={"/user/cart"} className={"ml-10 w-6 h-6 relative"}>
                    <LuShoppingCart size={24} />
                </Link>
                <Link href={"/user/login"} className="ml-10 w-6 h-6 justify-center items-center gap-2.5 flex">
                    <LuUserCircle2 size={24} />
                </Link>
            </div>
        </header>
    )
}

export default header