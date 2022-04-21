import { MicroCMSListResponse } from "microcms-js-sdk";
import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { client } from "src/libs/client";

export type Product = {
  name: string;
  description: string;
  price: number;
};

type Props = MicroCMSListResponse<Product>;

const Home: NextPage<Props> = (props) => {
  return (
    <div className="container mx-auto p-4">
      <ul className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {props.contents.map((content) => {
          return (
            <li key={content.id} className="group relative">
              <Link href={`/products/${content.id}`}>
                <a>
                  <Image
                    width={600}
                    height={400}
                    src="https://images.unsplash.com/photo-1599637777203-34ac21aa929b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2888&q=80"
                    alt="This is coffee beeeeeeeean."
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                  {content.name}
                </a>
              </Link>
              <div>¥{content.price}から</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await client.getList<Product>({ endpoint: "products" });
  return { props: data };
};

export default Home;
