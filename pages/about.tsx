import React, { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from "../lib/components/Header";
import Footer from "../lib/components/Footer";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const getServerSideProps = async ({ locale }: GetServerSidePropsContext) => ({
    props: {
        ...(await serverSideTranslations(locale!, ['common']))
    }
});

export default function About() {
    const [currentPage, setCurrentPage] = useState(0);
    const [isSliding, setIsSliding] = useState(false);

    const pages = [
        {
            content: (
                <p className="text-gray-700">
                    A sustentabilidade é um princípio fundamental para garantir a longevidade do nosso planeta. No nosso e-commerce de roupas com tema de TI, buscamos promover a conscientização sobre a importância de reduzir, reutilizar e reciclar. Através de iniciativas sustentáveis, podemos diminuir nosso impacto ambiental, preservando recursos naturais para as futuras gerações. 
                    Além disso, ao apoiar práticas ecológicas, incentivamos uma economia mais verde e justa, beneficiando tanto o meio ambiente quanto a sociedade.
                    Nossas peças são produzidas com materiais reciclados e métodos de fabricação sustentáveis, inspirados pelo mundo da tecnologia. Cada compra ajuda a promover uma moda mais consciente e responsável, refletindo nossa paixão por inovação e cuidado com o planeta. Venha explorar nossa coleção e faça parte da mudança para um futuro mais sustentável!
                </p>
            )
        },
        {
            content: (
                <p className="text-gray-700">
                    Nosso e-commerce de roupas com tema de TI oferece uma negociação segura e total proteção dos dados do usuário. Disponibilizamos uma página dedicada para você postar seus produtos e um chat ao vivo para facilitar a comunicação. Com isso, garantimos uma experiência de compra e venda eficiente e confiável, promovendo a sustentabilidade e o reaproveitamento de recursos.
                    Nossa plataforma é projetada para combinar tecnologia de ponta com práticas ecológicas, incentivando uma moda mais consciente e sustentável. Explore nossas opções seguras e fáceis de usar, e faça parte da nossa missão de criar um futuro mais verde e tecnológico!
                </p>
            )
        }
    ];

    const nextPage = () => {
        setIsSliding(true);
        setTimeout(() => {
            setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
            setIsSliding(false);
        }, 300);
    };

    const prevPage = () => {
        setIsSliding(true);
        setTimeout(() => {
            setCurrentPage((prevPage) => (prevPage - 1 + pages.length) % pages.length);
            setIsSliding(false);
        }, 300);
    };

    return (
        <main className="flex flex-col min-h-screen relative">
            <Header />
            <div className="flex flex-1 items-center justify-center p-4 relative">
                <div className="border border-gray-300 p-8 rounded-lg max-w-lg w-full text-center relative overflow-hidden min-h-64">
                    <h1 className="text-2xl font-semibold mb-4 text-green-800">Projeto de Faculdade: E-commerce sustentável para Programação</h1>
                    <div className="relative flex items-center justify-center">
                        <div className={`transition-transform duration-300 ${isSliding ? 'transform -translate-x-full' : 'transform translate-x-0'}`}>
                            {pages[currentPage].content}
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {pages.map((_, index) => (
                            <span
                                key={index}
                                className={`h-3 w-3 rounded-full ${currentPage === index ? 'bg-green-800' : 'bg-gray-300'}`}
                            ></span>
                        ))}
                    </div>
                </div>
                <button onClick={prevPage} className="absolute left-1/4 p-2 bg-gray-200 rounded-full shadow-lg transform -translate-y-1/2 top-1/2">
                    <FaChevronLeft />
                </button>
                <button onClick={nextPage} className="absolute right-1/4 p-2 bg-gray-200 rounded-full shadow-lg transform -translate-y-1/2 top-1/2">
                    <FaChevronRight />
                </button>
            </div>
            <Footer />
        </main>
    );
}
