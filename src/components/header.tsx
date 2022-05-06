import React, { FC } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "src/firebase";
import { useRouter } from "next/router";

const NAV_ITEMS = [
  { href: "/", label: "Coffee Shop" },
  { href: "/orders", label: "Orders" },
];

export const Header: FC<{ admin: {} | null }> = ({ admin }) => {
  const router = useRouter();
  const logout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header className="flex h-20 w-full items-center border-b">
      {NAV_ITEMS.map((item) => {
        return (
          <Link key={item.href} href={item.href}>
            <a className="ml-6 inline-block py-2 px-6 text-xl hover:text-blue-500 focus:text-blue-500 active:text-blue-500">
              {item.label}
            </a>
          </Link>
        );
      })}
      {admin ? (
        <button
          onClick={logout}
          className="ml-6 inline-block py-2 px-6 text-xl hover:text-blue-500 focus:text-blue-500 active:text-blue-500"
        >
          ログアウト
        </button>
      ) : null}
    </header>
  );
};
