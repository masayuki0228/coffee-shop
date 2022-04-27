import dayjs from "dayjs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "src/firebase";
import { Order } from "src/pages/test";
import useSWR from "swr";

const fetcher: (url: string) => Promise<any> = async (url) => {
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
  return orders;
};

export const useOrders = () => {
  const { data, error } = useSWR("firestore/orders", fetcher);
  return {
    data,
    error,
    isLoading: !error && !data,
    isEmpty: data && data.length === 0,
  };
};
