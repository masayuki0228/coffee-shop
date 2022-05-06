import { MicroCMSContentId, MicroCMSDate } from "microcms-js-sdk";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { client } from "src/libs/client";
import { Product } from "src/pages";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "src/firebase";
import Router from "next/router";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Head from "next/head";
import dayjs from "dayjs";

type Inputs = {
  userName: string;
  address: string;
};
type Props = Product & MicroCMSContentId & MicroCMSDate;

const ProductId: NextPage<Props> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("○○県○○市○○区○○町");
  const totalPrice = props.price + 300 + 300;

  const order: SubmitHandler<Inputs> = useCallback(async () => {
    const orderInfo = {
      productId: props.id,
      productName: props.name,
      userName: name,
      address: address,
      price: {
        totalPrice: totalPrice,
        productPrice: props.price,
        postage: 300,
        commission: 300,
      },
      timestamp: serverTimestamp(),
      date: dayjs(Date()).format("YYYY/MM/DD"),
      sent: false,
    };
    const docRef = await addDoc(collection(db, "orders"), orderInfo);
    Router.push({
      pathname: `/purchsed/${docRef.id}`,
      query: {
        name: name,
        adress: address,
      },
    });
  }, [address, name, props.id, props.name, props.price, totalPrice]);

  return (
    <>
      <Head>
        <title>【Coffee Shop】 商品詳細</title>
      </Head>
      <main className="flex h-full w-full items-center bg-white p-10">
        <div className="grid grid-cols-1 gap-8 pt-6 md:grid-cols-2">
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
            <h1 className="text-4xl font-bold capitalize">{props.name}</h1>
            <h2 className="mt-6 text-3xl">¥{props.price}から</h2>
            <article
              className="mt-6"
              dangerouslySetInnerHTML={{ __html: props.description }}
            />

            <form className="flex flex-col" onSubmit={handleSubmit(order)}>
              <label className="mt-6" htmlFor="name">
                お名前{" "}
                {errors.userName && (
                  <span className="text-sm text-red-400 ">
                    ※お名前が未入力です。
                  </span>
                )}
              </label>
              <input
                {...register("userName", { required: true })}
                className="w-full appearance-none rounded border p-2 leading-tight focus:outline-none"
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
              />

              <label className="mt-6" htmlFor="name">
                お届け先{" "}
                {errors.address && (
                  <span className="text-sm text-red-400 ">
                    ※お届け先が未入力です。
                  </span>
                )}
              </label>
              <input
                {...register("address", { required: true })}
                className="w-full appearance-none rounded border p-2 leading-tight focus:outline-none"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                type="text"
                id="address"
              />

              <label className="mt-6" htmlFor="send">
                配送方法
              </label>
              <input
                className="w-full appearance-none rounded border p-2 leading-tight focus:outline-none"
                id="send"
                type="text"
                value="宅急便 :¥300"
                readOnly
              ></input>

              <label className="mt-6" htmlFor="pay">
                お支払い方法
              </label>
              <input
                className="w-full appearance-none rounded border p-2 leading-tight focus:outline-none"
                id="pay"
                type="text"
                value="代金引換 : ¥300"
                readOnly
              ></input>
              <div className="mt-6">
                <p>小計 : ¥{props.price}</p>
                <p>送料 : ¥300</p>
                <p>手数料 : ¥300</p>
                <p>合計 : ¥{totalPrice}</p>
              </div>
              <input
                type="submit"
                className="mt-8 w-2/4 cursor-pointer rounded bg-sky-500 p-4 py-3 text-sm font-medium text-white hover:bg-sky-600"
                value="購入する"
              />
            </form>
          </div>
        </div>
      </main>
    </>
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
