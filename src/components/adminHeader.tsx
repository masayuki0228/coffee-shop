import React, { FC } from "react";
import Link from "next/link";
import { signOut, User } from "firebase/auth";
import { auth } from "src/firebase";
import { useRouter } from "next/router";

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
  console.log(admin.email);

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
      <div className="fixed  right-0 flex  items-center">
        <p>{admin.displayName}がログイン中</p>
        <button
          onClick={logout}
          className="ml-4 py-2 px-6 text-lg hover:text-blue-500 focus:text-blue-500 active:text-blue-500"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
};
