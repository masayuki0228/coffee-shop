import type { GetStaticProps, NextPage } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "src/firebase";
import dayjs from "dayjs";
import Head from "next/head";

export type Order = {
  id: string;
  productName: string;
  userName: string;
  address: string;
  price: {
    totalPrice: number;
  };
  date: string;
};

const Home: NextPage<any> = (props) => {
  console.log(props.orders);
  return (
    <div className="mx-auto p-4">
      <Head>
        <title>【Coffee Shop】 注文一覧</title>
      </Head>
      <table className="m-6 table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">注文Id</th>
            <th className="border px-4 py-2">お名前</th>
            <th className="border px-4 py-2">お届け先</th>
            <th className="border px-4 py-2">商品名</th>
            <th className="border px-4 py-2">価格</th>
            <th className="border px-4 py-2">購入日時</th>
          </tr>
        </thead>
        {props.orders.map((order: Order) => {
          return (
            <tbody key={order.id}>
              <tr>
                <td className="border px-2 py-1">{order.id}</td>
                <td className="border px-2 py-1">{order.userName}</td>
                <td className="border px-2 py-1">{order.address}</td>
                <td className="border px-2 py-1">{order.productName}</td>
                <td className="border px-2 py-1">¥{order.price.totalPrice}</td>
                <td className="border px-2 py-1">{order.date}</td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const orders: Order[] = [];
  const querySnapshot = await getDocs(collection(db, "orders"));
  querySnapshot.docs.map((doc) => {
    const date = dayjs(doc.data().timestamp.toDate()).format("YYYY/MM/DD");
    const data = {
      id: doc.id,
      userName: doc.data().userName,
      address: doc.data().address,
      productName: doc.data().productName,
      price: doc.data().price,
      date: date,
    };
    orders.push(data);
  });
  return { props: { orders } };
};

export default Home;
