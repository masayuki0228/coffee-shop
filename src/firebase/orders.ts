import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "src/firebase";
import { Order } from "src/types/order";

export const getOrders = async () => {
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
  console.log(orders);
  return orders;
};
