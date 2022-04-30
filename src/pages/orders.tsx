import type { GetServerSideProps, NextPage } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "src/firebase";
import dayjs from "dayjs";
import Head from "next/head";
import { OrdersTable } from "src/components/ordersTable";
import { Order } from "src/types/order";
import { Header } from "src/components/header";

type Props = {
  orders: Order[];
};

const Orders: NextPage<Props> = ({ orders }) => {
  return (
    <>
      <Head>
        <title>【Coffee Shop】 注文一覧</title>
      </Head>
      <Header />
      <OrdersTable orders={orders} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const orders: Order[] = [];
  const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
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

export default Orders;
