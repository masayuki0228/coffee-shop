import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ComponentProps, Dispatch, SetStateAction, useState, VFC } from "react";
import { db } from "src/firebase";
import { Order } from "src/types/order";
import { getOrders } from "src/firebase/orders";

type Props = {
  setOrderList: Dispatch<SetStateAction<Order[]>>;
};

export const SearchOrders: VFC<Props> = ({ setOrderList }) => {
  const [orderId, setOrderId] = useState("");
  const [userName, setUserName] = useState("");
  const [date, setDate] = useState("");

  const searchByOrderId: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (orderId == "") return;
    const order: Order[] = [];
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = {
        id: docSnap.id,
        userName: docSnap.data().userName,
        address: docSnap.data().address,
        productName: docSnap.data().productName,
        price: docSnap.data().price,
        date: docSnap.data().date,
        sent: docSnap.data().sent,
      };
      order.push(data);
      setOrderList(order);
      setOrderId("");
    } else {
      setOrderList([]);
      setOrderId("");
    }
  };

  const searchByUserName: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (userName == "") return;
    const orders: Order[] = [];
    const q = query(
      collection(db, "orders"),
      where("userName", "==", userName)
    );
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
    setUserName("");
  };

  const searchByDate: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (date == "") return;
    const orders: Order[] = [];
    const q = query(collection(db, "orders"), where("date", "==", date));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
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
    setDate("");
  };

  const handleClick: ComponentProps<"button">["onClick"] = async () => {
    const orders: Order[] = await getOrders();
    setOrderList(orders);
  };

  return (
    <div className="m-6">
      <form onSubmit={searchByOrderId}>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="appearance-none border p-1 focus:outline-none"
        />
        <button className="ml-2 border border-gray-600  p-1">
          注文Idで検索
        </button>
      </form>
      <form onSubmit={searchByUserName} className="mt-2">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="appearance-none border  p-1 focus:outline-none"
        />
        <button className="ml-2 border border-gray-600  p-1">
          お名前で検索
        </button>
      </form>
      <form onSubmit={searchByDate} className="mt-2">
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="appearance-none border  p-1 focus:outline-none"
        />
        <button className="ml-2 border border-gray-600 p-1">
          購入日時で検索
        </button>
      </form>
      <button
        type="reset"
        className="mt-2 border border-gray-600 p-1"
        onClick={handleClick}
      >
        リセット
      </button>
    </div>
  );
};
