import { MicroCMSListResponse } from "microcms-js-sdk";
import type { GetStaticProps, NextPage } from "next";
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
    <div>
      <p>{`ラインナップ: ${props.totalCount}種類`}</p>
      <ul>
        {props.contents.map((content) => {
          return (
            <li key={content.id}>
              <Link href={`/products/${content.id}`}>
              <a>{content.name}</a>
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
