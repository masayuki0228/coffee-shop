import type { NextPage } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "src/firebase";
import Head from "next/head";
import { OrdersTable } from "src/components/ordersTable";
import { Order } from "src/types/order";
import { useEffect, useState } from "react";
import { SearchOrders } from "src/components/searchOrders";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { AdminHeader } from "src/components/adminHeader";
import { Header } from "src/components/header";

type Props = {
  admin: User | null;
  loading: boolean;
};

const Orders: NextPage<Props> = ({ admin, loading }) => {
  const [orderList, setOrderList] = useState<Order[] | null>(null);
  const [undispatchedList, setUndispatchedList] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (!admin) {
      router.push("/");
    }
  }, [admin, loading, router]);

  useEffect(() => {
    if (loading) return;
    (async () => {
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
          sent: doc.data().sent,
        };
        orders.push(data);
      });
      setOrderList(orders);
    })();
  }, [loading]);

  return (
    <>
      <Head>
        <title>【Coffee Shop】 注文一覧</title>
      </Head>
      {admin ? <AdminHeader admin={admin} /> : <Header />}
      <div className="h-full lg:grid lg:grid-cols-6">
        <SearchOrders
          open={open}
          setOpen={setOpen}
          orderList={orderList}
          setOrderList={setOrderList}
          undispatchedList={undispatchedList}
          setUndispatchedList={setUndispatchedList}
        />
        <OrdersTable
          setOpen={setOpen}
          orderList={orderList}
          undispatchedList={undispatchedList}
          setUndispatchedList={setUndispatchedList}
        />
      </div>
    </>
  );
};

export default Orders;
