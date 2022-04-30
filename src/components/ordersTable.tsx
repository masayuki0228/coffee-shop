import { VFC } from "react";
import { Order } from "src/types/order";

type Props = {
  orders: Order[];
};

export const OrdersTable: VFC<Props> = ({ orders }) => {
  if (!orders) {
    return <div>Loading...</div>;
  }
  if (orders && orders.length === 0) {
    return <div>No orders found.</div>;
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
        </tr>
      </thead>
      {orders.map((order: Order) => {
        return (
          <tbody key={order.id} className="flex-shrink-0">
            <tr>
              <td className="border px-2 py-1">{order.id}</td>
              <td className="border px-2 py-1">{order.userName}</td>
              <td className="border px-2 py-1">{order.address}</td>
              <td className="border px-2 py-1">{order.productName}</td>
              <td className="border px-2 py-1">¥{order.price.totalPrice}</td>
              <td className="border px-2 py-1">{order.date}</td>
            </tr>
          </tbody>
        );
      })}
    </table>
  );
};
