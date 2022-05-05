import "src/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "src/firebase";

function MyApp({ Component, pageProps }: AppProps) {
  const [admin, setAdmin] = useState<{} | null>("");
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setAdmin(currentUser);
    });
  }, []);

  return <Component {...pageProps} admin={admin} setAdmin={setAdmin} />;
}

export default MyApp;
