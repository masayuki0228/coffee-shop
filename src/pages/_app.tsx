import "src/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "src/firebase";
import { Header } from "src/components/header";

function MyApp({ Component, pageProps }: AppProps) {
  const [admin, setAdmin] = useState<{} | any>();
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setAdmin(currentUser);
    });
  }, []);

  return (
    <>
      <Header admin={admin} />
      <Component {...pageProps} admin={admin} setAdmin={setAdmin} />
    </>
  );
}

export default MyApp;
