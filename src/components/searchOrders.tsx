import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";
import { Dispatch, SetStateAction, VFC } from "react";
import { db } from "src/firebase";
import { Order } from "src/types/order";

type Props = {
  setOrderList: Dispatch<SetStateAction<Order[]>>;
};

export const SearchOrders: VFC<Props> = ({ setOrderList }) => {
  const search = async () => {
    const order: Order[] = [];
    const docRef = doc(db, "orders", "ebeEIaucMuh6NTjiKo0s");
    const docSnap: DocumentSnapshot<DocumentData | any> = await getDoc(docRef); // 意味のない型
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
  };

  return (
    <div>
      <button onClick={search}>searchByOrderId</button>
    </div>
  );
};
