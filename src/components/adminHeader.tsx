import React, { FC } from "react";
import Link from "next/link";
import { signOut, User } from "firebase/auth";
import { auth } from "src/firebase";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

const NAV_ITEMS = [
  { href: "/", label: "Coffee Shop" },
  { href: "/orders", label: "Orders" },
];

export const AdminHeader: FC<{ admin: User }> = ({ admin }) => {
  const router = useRouter();
  const logout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="bg-white">
      {/* ここから */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pt-5 pb-2">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  {NAV_ITEMS.map((page) => (
                    <Link key={page.label} href={page.href}>
                      <a
                        className="block p-2 text-xl hover:text-blue-500 focus:text-blue-500 active:text-blue-500"
                        onClick={() => setOpen(false)}
                      >
                        {page.label}
                      </a>
                    </Link>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/* ここまで Mobile menu */}

      <header>
        <nav>
          <div className="flex h-20 items-center border-b border-gray-200">
            <button
              type="button"
              className="ml-4 p-2 text-gray-600 sm:ml-6 lg:hidden"
              onClick={() => setOpen(true)}
            >
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
              <div className="flex h-full space-x-8">
                {NAV_ITEMS.map((page) => (
                  <Link key={page.label} href={page.href}>
                    <a className="flex items-center text-xl hover:text-blue-500 focus:text-blue-500 active:text-blue-500">
                      {page.label}
                    </a>
                  </Link>
                ))}
              </div>
            </Popover.Group>

            <div className="ml-auto mr-4 flex items-center gap-x-4 p-2 sm:mr-6">
              <p>{admin.displayName}がログイン中</p>
              <button
                onClick={logout}
                className="p-4 text-lg hover:text-blue-500 focus:text-blue-500 active:text-blue-500"
              >
                ログアウト
              </button>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};
