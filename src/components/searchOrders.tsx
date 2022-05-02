import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ComponentProps, Dispatch, SetStateAction, useState, VFC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { db } from "src/firebase";
import { Order } from "src/types/order";

type Input = {
  orderId: string;
};

type Props = {
  setOrderList: Dispatch<SetStateAction<Order[]>>;
};

export const SearchOrders: VFC<Props> = ({ setOrderList }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  const [orderId, setOrderId] = useState("");

  const searchByOrderId: SubmitHandler<Input> = async () => {
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
      };
      order.push(data);
      setOrderList(order);
    } else {
      setOrderList([]);
    }
  };

  const searchByUserName: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    const value = e.currentTarget.query.value;
    const orders: Order[] = [];
    const q = query(collection(db, "orders"), where("userName", "==", value));
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
    setOrderList(orders);
  };

  const searchByDate: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    const value = e.currentTarget.query.value;
    const orders: Order[] = [];
    const q = query(collection(db, "orders"), where("date", "==", value));
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
      };
      orders.push(data);
    });
    setOrderList(orders);
  };

  const handleClick: ComponentProps<"button">["onClick"] = async () => {
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
    setOrderList(orders);
  };

  return (
    <div className="m-6">
      <form onSubmit={handleSubmit(searchByOrderId)}>
        <input
          {...register("orderId", { required: true })}
          type="text"
          onChange={(e) => setOrderId(e.target.value)}
          className="appearance-none border p-1 focus:outline-none"
        />
        <button className="ml-2 border border-gray-600  p-1">
          注文Idで検索
        </button>
        <label className="ml-2">
          {errors.orderId && (
            <span className="text-sm text-red-400 ">※注文Idが未入力です。</span>
          )}
        </label>
      </form>
      <form onSubmit={searchByUserName} className="mt-2">
        <input
          type="text"
          name="query"
          className="appearance-none border  p-1 focus:outline-none"
        />
        <button className="ml-2 border border-gray-600  p-1">
          お名前で検索
        </button>
      </form>
      <form onSubmit={searchByDate} className="mt-2">
        <input
          type="text"
          name="query"
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
