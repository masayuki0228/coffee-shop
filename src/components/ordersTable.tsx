import { Popover } from "@headlessui/react";
import { ComponentProps, Dispatch, FC, SetStateAction } from "react";
import { Order } from "src/types/order";

type Props = {
  orderList: Order[] | null;
  undispatchedList: string[];
  setUndispatchedList: Dispatch<SetStateAction<string[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const OrdersTable: FC<Props> = (props) => {
  const { orderList, undispatchedList, setUndispatchedList, setOpen } = props;

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
    return <div className="m-6">No orders found.</div>;
  }
  return (
    <div>
      <div className="lg:hidden">
        <div className="bg-gray-100 p-4">
          <button
            className="mx-auto flex rounded border bg-white p-3 font-semibold"
            onClick={() => setOpen(true)}
          >
            検索・発送処理
          </button>
        </div>
        {orderList.map((order: Order) => {
          return (
            <div
              key={order.id}
              className="flex items-center justify-between border-b py-4 pl-4 pr-6"
            >
              <div>
                <p className="px-2 py-1 md:px-6 ">{order.productName}</p>
                <p className="px-2 py-1 md:px-6 ">{order.date}</p>
              </div>
              {order.sent ? (
                "発送済み"
              ) : (
                <div>
                  未発送
                  <input
                    className="ml-2"
                    type="checkbox"
                    value={order.id}
                    onChange={handleChange}
                    checked={undispatchedList.includes(order.id)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Popover.Group className="hidden lg:block">
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
                  <td className="border px-2 py-1">
                    ¥{order.price.totalPrice}
                  </td>
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
      </Popover.Group>
    </div>
  );
};
