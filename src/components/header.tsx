import React, { FC } from "react";
import Link from "next/link";

export const Header: FC = () => {
  return (
    <header className="flex h-20 w-full items-center border-b">
      <Link href="/">
        <a className="ml-6 inline-block py-2 px-6 text-xl hover:text-blue-500 focus:text-blue-500 active:text-blue-500">
          Coffee Shop
        </a>
      </Link>
    </header>
  );
};
