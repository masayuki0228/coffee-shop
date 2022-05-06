import { auth } from "src/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";

type Inputs = {
  email: string;
  password: string;
};

type Props = {
  admin: {} | null;
  setAdmin: Dispatch<SetStateAction<{} | null>>;
};

const Login: FC<Props> = ({ admin, setAdmin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login: SubmitHandler<Inputs> = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(`${userCredential.user.email}がログインしました。`);
    } catch (error) {
      alert("正しく入力してください");
      console.log(error);
    }
  };
  console.log(admin);

  useEffect(() => {
    if (admin) {
      router.push("/");
    }
  }, [admin, router]);

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit(login)}>
        <div>
          <input
            {...register("email", { required: true })}
            className="appearance-none rounded border p-2 leading-tight focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            id="name"
          />
          <label className="mt-6" htmlFor="name">
            メールアドレス{" "}
            {errors.email && (
              <span className="text-sm text-red-400 ">
                ※メールアドレスが未入力です。
              </span>
            )}
          </label>
        </div>
        <div>
          <input
            {...register("password", { required: true })}
            className="appearance-none rounded border p-2 leading-tight focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            id="name"
          />
          <label className="mt-6" htmlFor="name">
            パスワード{" "}
            {errors.password && (
              <span className="text-sm text-red-400 ">
                ※パスワードが未入力です。
              </span>
            )}
          </label>
        </div>
        <div>
          <button>ログイン</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
