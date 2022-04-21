import { MicroCMSContentId, MicroCMSDate } from "microcms-js-sdk";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { client } from "src/libs/client";
import { Product } from "src/pages";

type Props = Product & MicroCMSContentId & MicroCMSDate;

const ProductId: NextPage<Props> = (props) => {
  return (
    <div>
      <h1>{props.name}</h1>
      <div dangerouslySetInnerHTML={{ __html: props.description }} />
    </div>
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
