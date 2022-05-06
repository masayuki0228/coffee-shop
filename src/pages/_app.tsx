import "src/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "src/firebase";
import { Header } from "src/components/header";
import { AdminHeader } from "src/components/adminHeader";

function MyApp({ Component, pageProps }: AppProps) {
  const [admin, setAdmin] = useState<User | null>();
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setAdmin(currentUser);
    });
  }, []);

  return (
    <>
      {admin ? <AdminHeader admin={admin} /> : <Header />}
      <Component {...pageProps} admin={admin} setAdmin={setAdmin} />
    </>
  );
}

export default MyApp;
