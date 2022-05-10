import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "src/components/header";

const Purchsed: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>【Coffee Shop】 Thank you!!!</title>
      </Head>
      <Header />
      <div className="container mx-auto p-12 text-center">
        <p>ご購入ありがとうございました！</p>
        <p>注文ID : {router.query.id}</p>
        <p>お名前 : {router.query.name}</p>
        <p>お届け先 : {router.query.adress}</p>
        <button
          onClick={() => {
            router.push("/");
          }}
          className="mt-6  w-full rounded bg-sky-500 p-4 py-3 text-sm font-medium text-white hover:bg-sky-600 sm:w-1/4"
        >
          一覧に戻る
        </button>
      </div>
    </>
  );
};

export default Purchsed;
