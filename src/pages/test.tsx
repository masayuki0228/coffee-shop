import type { GetServerSideProps, NextPage } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
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



const Test: NextPage<any> = (props) => {
  const { orders } = props;
  if (!orders) {
    return <div>ローディング中</div>;
  }
  if (orders && orders.length === 0) {
    return <div>データは空です</div>;
  }
  return (
    <div>
      <Head>
        <title>【Coffee Shop】 注文一覧</title>
      </Head>
      <div className="mx-auto p-4">
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
          {orders.map((order: Order) => {
            return (
              <tbody key={order.id}>
                <tr>
                  <td className="border px-2 py-1">{order.id}</td>
                  <td className="border px-2 py-1">{order.userName}</td>
                  <td className="border px-2 py-1">{order.address}</td>
                  <td className="border px-2 py-1">{order.productName}</td>
                  <td className="border px-2 py-1">
                    ¥{order.price.totalPrice}
                  </td>
                  <td className="border px-2 py-1">{order.date}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const orders: Order[] = [];
  const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot) {
    return { notFound: true };
  }
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
  return {
    props: { orders },
  };
};

export default Test;
