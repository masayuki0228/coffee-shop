import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Purchsed: NextPage = () => {
  const router = useRouter();
  return (
    <div className="container mx-auto p-12 text-center">
      <Head>
        <title>【Coffee Shop】 Thank you!!!</title>
      </Head>
      <p>ご購入ありがとうございました！</p>
      <p>注文ID : {router.query.id}</p>
      <p>お名前 : {router.query.name}</p>
      <p>お届け先 : {router.query.adress}</p>
      <button
        onClick={() => {
          router.push("/");
        }}
        className="m-6 w-1/4 bg-sky-500 px-4 py-3 text-center text-white"
      >
        一覧に戻る
      </button>
    </div>
  );
};

export default Purchsed;
