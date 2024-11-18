export interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo: string;
  carts: CartItem[];
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
}
