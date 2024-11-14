export interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo: string;
  carts: Cart[];
}

export interface Cart {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
}


