import { MicroCMSContentId, MicroCMSDate } from "microcms-js-sdk";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { client } from "src/libs/client";
import { Product } from "src/pages";

type Props = Product & MicroCMSContentId & MicroCMSDate;

const ProductId: NextPage<Props> = (props) => {
  return (
    <main className="flex h-full w-full items-center bg-white p-10">
      <div className="grid grid-cols-2 gap-8 pt-16">
        <div className="flex flex-col justify-start">
          <Image
            width={600}
            height={400}
            src="https://images.unsplash.com/photo-1599637777203-34ac21aa929b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2888&q=80"
            alt="This is coffee beeeeeeeean."
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold capitalize">{props.name}</h1>
            <h2 className="text-3xl">¥{props.price}から</h2>
            <p dangerouslySetInnerHTML={{ __html: props.description }} />
            {/* <p className="text-lg text-gray-500	">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatibus voluptatum nisi maxime obcaecati impedit? Ratione
              error eum qui quidem? Veniam accusamus ea repudiandae itaque,
              explicabo quidem perspiciatis. Culpa, asperiores deserunt.
            </p> */}
            <div className="my-6 flex cursor-pointer items-center gap-4 ">
              <div className="w-2/4 bg-sky-500 px-5 py-3 text-center text-white">
                購入する
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  const data = await client.getList({ endpoint: "products" });
  const ids = data.contents.map((content) => `/products/${content.id}`);
  return {
    paths: ids,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, { id: string }> = async (
  ctx
) => {
  if (!ctx.params) {
    return { notFound: true };
  }
  const data = await client.getListDetail<Product>({
    endpoint: "products",
    contentId: ctx.params.id,
  });
  return { props: data };
};

export default ProductId;
