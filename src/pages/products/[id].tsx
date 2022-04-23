import { MicroCMSContentId, MicroCMSDate } from "microcms-js-sdk";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { client } from "src/libs/client";
import { Product } from "src/pages";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "src/firebase";
import Router from "next/router";

type Props = Product & MicroCMSContentId & MicroCMSDate;

const ProductId: NextPage<Props> = (props) => {
  const totalPrice = props.price + 300 + 300;
  const order = async () => {
    const docRef = await addDoc(collection(db, "orders"), {
      product_id: props.id,
      name: props.name,
      price: {
        totalPrice: totalPrice,
        productPrice: props.price,
        postage: 300,
        commission: 300,
      },
      timestamp: serverTimestamp(),
    });
    Router.push({
      pathname: `/purchsed/${docRef.id}`,
      query: {
        Id: docRef.id,
        name: "aaa",
        adress: "bbb",
      },
    });
  };

  return (
    <main className="flex h-full w-full items-center bg-white p-10">
      <div className="grid grid-cols-2 gap-8 pt-8">
        <div className="flex flex-col justify-start">
          <Image
            width={600}
            height={400}
            src="https://images.unsplash.com/photo-1599637777203-34ac21aa929b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2888&q=80"
            alt="This is coffee beeeeeeeean."
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold capitalize">{props.name}</h1>
            <h2 className="mt-4 text-3xl">¥{props.price}から</h2>
            <article
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: props.description }}
            />
            <label className="mt-4" htmlFor="name">
              お名前
            </label>
            <input
              className="w-full appearance-none rounded border p-2 leading-tight focus:outline-none"
              type="text"
              id="name"
            />
            <label className="mt-4" htmlFor="adress">
              お届け先
            </label>
            <input
              className="w-full appearance-none rounded border p-2 leading-tight focus:outline-none"
              type="text"
              id="adress"
            />

            <label className="mt-4" htmlFor="send">
              配送方法
            </label>
            <input
              className="w-full appearance-none rounded border p-2 leading-tight focus:outline-none"
              id="send"
              type="text"
              value="宅急便 (￥300)"
              readOnly
            ></input>

            <label className="mt-4" htmlFor="pay">
              お支払い方法
            </label>
            <input
              className="w-full appearance-none rounded border p-2 leading-tight focus:outline-none"
              id="pay"
              type="text"
              value="代金引換 (￥300)"
              readOnly
            ></input>

            <button
              onClick={order}
              className="mt-4 w-2/4 bg-sky-500 px-5 py-3 text-center text-white"
            >
              購入する
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  const data = await client.getList({ endpoint: "products" });
  const ids = data.contents.map((content) => `/products/${content.id}`);
  return {
    paths: ids,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, { id: string }> = async (
  ctx
) => {
  if (!ctx.params) {
    return { notFound: true };
  }
  const data = await client.getListDetail<Product>({
    endpoint: "products",
    contentId: ctx.params.id,
  });
  return { props: data };
};

export default ProductId;
