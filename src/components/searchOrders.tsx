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
  setOrderList: Dispatch<SetStateAction<Order[] | null>>;
};

export const SearchOrders: VFC<Props> = ({ setOrderList }) => {
  const [orderId, setOrderId] = useState("");
  const [userName, setUserName] = useState("");

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

  const handleClick: ComponentProps<"button">["onClick"] = async () => {
    const orders: Order[] = await getOrders();
    setOrderList(orders);
  };

  return (
    <div className="flex-col border-r bg-gray-100 px-6">
      <form onSubmit={searchByOrderId}>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="mt-8 rounded border py-2 pl-4 text-sm text-gray-500 focus:outline-none md:mt-12 md:w-full"
          placeholder="Search"
        />
        <button className="mt-4 ml-2 rounded border bg-white  p-1 md:ml-0 md:w-full">
          注文Idで検索
        </button>
      </form>

      <form onSubmit={searchByUserName} className="mt-2">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="rounded border py-2 pl-4 text-sm text-gray-500 focus:outline-none md:mt-12 md:w-full"
          placeholder="Search"
        />
        <button className="mt-4 ml-2 rounded border bg-white p-1 md:ml-0 md:w-full">
          お名前で検索
        </button>
      </form>
      <button
        type="reset"
        className="my-4 rounded border bg-white p-1 md:mt-12 md:w-full"
        onClick={handleClick}
      >
        リセット
      </button>
    </div>
  );
};
