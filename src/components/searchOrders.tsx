import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ComponentProps,
  Dispatch,
  FC,
  SetStateAction,
  useState,
  Fragment,
} from "react";
import { db } from "src/firebase";
import { Order } from "src/types/order";
import { getOrders } from "src/firebase/orders";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

type Props = {
  orderList: Order[] | null;
  setOrderList: Dispatch<SetStateAction<Order[] | null>>;
  undispatchedList: string[];
  setUndispatchedList: Dispatch<SetStateAction<string[]>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const SearchOrders: FC<Props> = (props) => {
  const {
    orderList,
    setOrderList,
    undispatchedList,
    setUndispatchedList,
    open,
    setOpen,
  } = props;
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
      setOpen(false);
    } else {
      setOrderList([]);
      setOrderId("");
      setOpen(false);
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
    setOpen(false);
  };

  const handleClick: ComponentProps<"button">["onClick"] = async () => {
    const orders: Order[] = await getOrders();
    setOrderList(orders);
    setOpen(false);
  };

  const setSent: ComponentProps<"button">["onClick"] = async () => {
    undispatchedList.map(async (undispatched) => {
      const washingtonRef = doc(db, "orders", undispatched);
      await updateDoc(washingtonRef, {
        sent: true,
      });
    });
    const orders: Order[] = [];
    orderList?.map((order) => {
      const data = order;
      if (undispatchedList.includes(order.id)) {
        data.sent = true;
      }
      orders.push(data);
    });
    setOrderList(orders);
    setOpen(false);
  };

  const allCheck: ComponentProps<"button">["onClick"] = () => {
    const list: string[] = [];
    orderList?.map((order) => {
      if (!order.sent) {
        list.push(order.id);
      }
    });
    setUndispatchedList(list);
    setOpen(false);
  };

  return (
    <>
      {/* ここから */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden " onClose={setOpen}>
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
                    検索・発送処理
                  </p>
                  <button
                    className="col-start-3 my-4 mr-5 justify-self-end px-3"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="h-full bg-gray-100 p-8">
                  <form onSubmit={searchByOrderId}>
                    <input
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full rounded border py-2 pl-4 text-sm text-gray-500 focus:outline-none"
                      placeholder="Search"
                    />
                    <button className="mt-4 w-full rounded border bg-white p-1">
                      注文Idで検索
                    </button>
                  </form>
                  <form onSubmit={searchByUserName} className="mt-12">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full rounded border py-2 pl-4 text-sm text-gray-500 focus:outline-none"
                      placeholder="Search"
                    />
                    <button className="mt-4 w-full rounded border bg-white p-1">
                      お名前で検索
                    </button>
                  </form>
                  <button
                    type="reset"
                    className="mt-4 w-full rounded border bg-white p-1"
                    onClick={handleClick}
                  >
                    リセット
                  </button>
                  <button
                    className="mt-20 w-full rounded border bg-white p-1"
                    onClick={allCheck}
                  >
                    全て選択する
                  </button>
                  <button
                    className="mt-4 w-full rounded border bg-white p-1"
                    onClick={setSent}
                  >
                    選択した注文を
                    <br />
                    発送済みにする
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/* ここまで Mobile menu */}

      <Popover.Group className="hidden lg:block">
        <div className="flex h-full space-x-8">
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
              className="mt-4 rounded border bg-white p-1 md:mt-12 md:w-full"
              onClick={handleClick}
            >
              リセット
            </button>
            <button
              className="mt-4 rounded border bg-white p-1 md:mt-12 md:w-full"
              onClick={allCheck}
            >
              全て選択する
            </button>
            <button
              className="mt-4 rounded border bg-white p-1 md:w-full"
              onClick={setSent}
            >
              選択した注文を
              <br />
              発送済みにする
            </button>
          </div>
        </div>
      </Popover.Group>
    </>
  );
};
