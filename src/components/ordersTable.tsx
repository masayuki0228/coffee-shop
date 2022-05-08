import { Dialog, Popover, Transition } from "@headlessui/react";
import { DotsCircleHorizontalIcon, XIcon } from "@heroicons/react/outline";
import {
  ComponentProps,
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useState,
} from "react";
import { Order } from "src/types/order";

type Props = {
  orderList: Order[] | null;
  undispatchedList: string[];
  setUndispatchedList: Dispatch<SetStateAction<string[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const OrdersTable: FC<Props> = (props) => {
  const { orderList, undispatchedList, setUndispatchedList, setOpen } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalOrder, setModalOrder] = useState<Order | null>();

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
              <div className="flex">
                <DotsCircleHorizontalIcon
                  className="my-auto h-6 w-6"
                  onClick={() => {
                    setModalOrder(order);
                    setModalOpen(true);
                  }}
                />
                <div>
                  <p className="px-2 py-1 md:px-6">{order.productName}</p>
                  <p className="px-2 py-1 md:px-6">{order.date}</p>
                </div>
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
      <Transition.Root show={modalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={() => setModalOpen(false)}
        >
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-y-full"
              enterTo="-translate-y-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="-translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="mx-auto flex w-full flex-col bg-white">
                <div className="grid h-20 grid-cols-3 border-y">
                  <p className="col-start-2 m-auto p-3 font-semibold">
                    注文詳細
                  </p>
                  <button
                    className="col-start-3 my-4 mr-5 justify-self-end px-3"
                    onClick={() => {
                      setModalOrder(null);
                      setModalOpen(false);
                    }}
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="h-full bg-gray-100 p-8">
                  <p className="px-2 py-1">注文Id : {modalOrder?.id}</p>
                  <p className="px-2 py-1">お名前 : {modalOrder?.userName}</p>
                  <p className="px-2 py-1">お届け先 : {modalOrder?.address}</p>
                  <p className="px-2 py-1">
                    商品名 : {modalOrder?.productName}
                  </p>
                  <p className="px-2 py-1">
                    価格 : ¥{modalOrder?.price.totalPrice}
                  </p>
                  <p className="px-2 py-1">購入日時 : {modalOrder?.date}</p>
                  <p className="px-2 py-1">
                    発送状況 : {modalOrder?.sent ? "発送済み" : "未発送"}
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
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
