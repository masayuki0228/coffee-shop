import { ComponentProps, Dispatch, FC, SetStateAction } from "react";
import { Order } from "src/types/order";

type Props = {
  orderList: Order[] | null;
  undispatchedList: string[];
  setUndispatchedList: Dispatch<SetStateAction<string[]>>;
};

export const OrdersTable: FC<Props> = (props) => {
  const { orderList, undispatchedList, setUndispatchedList } = props;

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

  if (!orderList) {
    return <div className="m-6">Loading...</div>;
  }
  if (orderList && orderList.length === 0) {
    return <div className="m-6 ">No orders found.</div>;
  }
  return (
    <table className="m-6 h-fit overflow-x-auto whitespace-nowrap">
      <thead>
        <tr>
          <th className="border px-4 py-2">注文Id</th>
          <th className="border px-4 py-2">お名前</th>
          <th className="border px-4 py-2">お届け先</th>
          <th className="border px-4 py-2">商品名</th>
          <th className="border px-4 py-2">価格</th>
          <th className="border px-4 py-2">購入日時</th>
          <th className="border px-4 py-2">発送状況</th>
        </tr>
      </thead>
      {orderList.map((order: Order) => {
        return (
          <tbody key={order.id}>
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
