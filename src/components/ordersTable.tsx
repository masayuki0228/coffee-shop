import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { ComponentProps, Dispatch, SetStateAction, useState, VFC } from "react";
import { db } from "src/firebase";
import { Order } from "src/types/order";

type Props = {
  orderList: Order[];
  setOrderList: Dispatch<SetStateAction<Order[]>>;
};

export const OrdersTable: VFC<Props> = ({ orderList, setOrderList }) => {
  const [undispatchedList, setUndispatchedList] = useState<string[]>([]);

  const handleChange: ComponentProps<"input">["onChange"] = (e) => {
    if (undispatchedList.includes(e.target.value)) {
      setUndispatchedList(
        undispatchedList.filter(
          (undispatched) => undispatched !== e.target.value
        )
      );
    } else {
      setUndispatchedList([...undispatchedList, e.target.value]);
    }
  };

  const setSent: ComponentProps<"button">["onClick"] = async () => {
    undispatchedList.map(async (undispatched) => {
      const washingtonRef = doc(db, "orders", undispatched);
      await updateDoc(washingtonRef, {
        sent: true,
      });
      const orders: Order[] = [];
      orderList.map((order) => {
        const data = order;
        if (undispatchedList.includes(order.id)) {
          order.sent = !order.sent;
        }
        orders.push(data);
      });
      setOrderList(orders);
    });
  };

  if (!orderList) {
    return <div className="m-6">Loading...</div>;
  }
  if (orderList && orderList.length === 0) {
    return <div className="m-6 ">No orders found.</div>;
  }
  return (
    <table className="m-6 overflow-x-auto whitespace-nowrap p-4">
      <thead className="flex-shrink-0">
        <tr>
          <th className="border px-4 py-2">注文Id</th>
          <th className="border px-4 py-2">お名前</th>
          <th className="border px-4 py-2">お届け先</th>
          <th className="border px-4 py-2">商品名</th>
          <th className="border px-4 py-2">価格</th>
          <th className="border px-4 py-2">購入日時</th>
          <th className="border px-2">
            <button onClick={setSent} className="border border-gray-600 p-1">
              発送済みにする
            </button>
          </th>
        </tr>
      </thead>
      {orderList.map((order: Order) => {
        return (
          <tbody key={order.id} className="flex-shrink-0">
            <tr>
              <td className="border px-2 py-1">{order.id}</td>
              <td className="border px-2 py-1">{order.userName}</td>
              <td className="border px-2 py-1">{order.address}</td>
              <td className="border px-2 py-1">{order.productName}</td>
              <td className="border px-2 py-1">¥{order.price.totalPrice}</td>
              <td className="border px-2 py-1">{order.date}</td>
              <td className="border px-2 py-1 text-center">
                {order.sent ? (
                  "発送済み"
                ) : (
                  <>
                    未発送
                    <input
                      className="ml-2 "
                      type="checkbox"
                      value={order.id}
                      onChange={handleChange}
                      checked={undispatchedList.includes(order.id)}
                    />
                  </>
                )}
              </td>
            </tr>
          </tbody>
        );
      })}
    </table>
  );
};
