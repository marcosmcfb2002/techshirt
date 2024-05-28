import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import React from "react";
import Header from "../lib/components/Header";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Footer from "../lib/components/Footer";

export const getServerSideProps = async ({ locale }: GetServerSidePropsContext) => ({
    props: {
        ...(await serverSideTranslations(locale!, ['common']))
    }
});

export default function category() {
    return (
        <main>
            <Header/>
            <a>Categoria</a>
            <Footer/>
        </main>
    );
}