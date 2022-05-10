import React, { FC } from "react";
import Link from "next/link";
import { signOut, User } from "firebase/auth";
import { auth } from "src/firebase";
import { useRouter } from "next/router";
import { useState } from "react";
import { Popover } from "@headlessui/react";
import { ExternalLinkIcon, MenuIcon } from "@heroicons/react/outline";
import { AdminHeaderSideBar } from "src/components/mobileUI/adminHeaderSideBar";

export const NAV_ITEMS = [{ href: "/orders", label: "Orders" }];

export const AdminHeader: FC<{ admin: User }> = ({ admin }) => {
  const router = useRouter();
  const logout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="bg-white">
      <AdminHeaderSideBar open={open} setOpen={setOpen} />
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
                <a
                  className="flex items-center text-xl hover:text-blue-500 focus:text-blue-500 active:text-blue-500"
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ショップを見る
                  <ExternalLinkIcon className="h-5 w-5 ml-1" aria-hidden="true" />
                </a>
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
