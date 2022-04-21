import React from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Coffee Shop" },
];

export const Header = () => {
  return (
    <header className="flex items-center border-b w-full h-20">
      {NAV_ITEMS.map((item) => {
        return (
          <Link key={item.href} href={item.href}>
            <a className="inline-block ml-6 py-2 px-6 text-xl hover:text-blue-500 focus:text-blue-500 active:text-blue-500">{item.label}</a>
          </Link>
        );
      })}
    </header>
  );
};