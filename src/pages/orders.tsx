import type { GetServerSideProps, NextPage } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "src/firebase";
import Head from "next/head";
import { OrdersTable } from "src/components/ordersTable";
import { Order } from "src/types/order";
import { Header } from "src/components/header";
import { useState } from "react";
import { SearchOrders } from "src/components/searchOrders";

type Props = {
  orders: Order[];
};

const Orders: NextPage<Props> = ({ orders }) => {
  const [orderList, setOrderList] = useState(orders);
  return (
    <>
      <Head>
        <title>【Coffee Shop】 注文一覧</title>
      </Head>
      <Header />
      <SearchOrders setOrderList={setOrderList} />
      <OrdersTable orderList={orderList} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const orders: Order[] = [];
  const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.docs.map((doc) => {
    const data = {
      id: doc.id,
      userName: doc.data().userName,
      address: doc.data().address,
      productName: doc.data().productName,
      price: doc.data().price,
      date: doc.data().date,
    };
    orders.push(data);
  });
  return {
    props: { orders },
  };
};

export default Orders;
