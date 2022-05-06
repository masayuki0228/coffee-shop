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
    <>
      <div className="flex justify-center px-4 pt-36 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to admin account
          </h2>
          <form className="mt-8" onSubmit={handleSubmit(login)}>
            <div>
              <input
                {...register("email", { required: true })}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full appearance-none rounded border border-gray-300 px-3 py-2 placeholder-gray-500 focus:outline-none sm:text-sm"
                type="email"
                id="email"
                placeholder="Email address"
              />
              {errors.email ? (
                <span className="text-sm text-red-400 ">
                  ※メールアドレスが未入力です。
                </span>
              ) : (
                <span>&nbsp;</span>
              )}
            </div>
            <div>
              <input
                {...register("password", { required: true })}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full appearance-none rounded border border-gray-300 px-3 py-2 placeholder-gray-500 focus:outline-none sm:text-sm"
                type="password"
                id="password"
                placeholder="password"
              />
              {errors.password ? (
                <span className="text-sm text-red-400 ">
                  ※パスワードが未入力です。
                </span>
              ) : (
                <span>&nbsp;</span>
              )}
            </div>

            <div>
              <button
                type="submit"
                className=" mt-6  w-full  rounded bg-sky-500 p-4 py-3 text-sm font-medium text-white hover:bg-sky-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
