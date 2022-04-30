export type Order = {
  id: string;
  productName: string;
  userName: string;
  address: string;
  price: {
    totalPrice: number;
  };
  date: string;
};