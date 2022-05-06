import { auth } from "src/firebase";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";

type Inputs = {
  email: string;
  password: string;
};

type Props = {
  admin: User | null;
};

const Login: FC<Props> = ({ admin }) => {
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
    <div className="container mx-auto p-12 text-center">
      <h1>ログインページ</h1>
      <form onSubmit={handleSubmit(login)}>
        <div>
          <input
            {...register("email", { required: true })}
            className="appearance-none rounded border mt-6 p-2 leading-tight focus:outline-none"
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
            className="appearance-none rounded border mt-2 p-2 leading-tight focus:outline-none"
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
          <button className="m-4 w-1/4 px-4 py-3 text-center border">ログイン</button>
        </div>
      </form>
      <p>メールアドレス : test@test.com</p>
      <p>パスワード : coffee</p>
      <p>で、ログインできます。</p>
    </div>
  );
};

export default Login;
