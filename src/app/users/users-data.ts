export interface Geolocation {
  lat: string;
  long: string;
}

export interface Address {
  geolocation: Geolocation;
  city: string;
  street: string;
  number: number;
  zipcode: string;
}

export interface Name {
  firstname: string;
  lastname: string;
}

export interface User {
  address: Address;
  id: number;
  email: string;
  username: string;
  password: string;
  name: Name;
  phone: string;
  __v: number;
}

export type UsersData = User[];

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: [{ productId: number; quantity: number }];
}
export type CartData = Cart[];

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export type ProductsData = Product[];

export interface UserTableData {
  name: string;
  lastVisit: string;
  totalSpent: number;
  photo: string;
}

export interface UserPhoto{
  id: number,
  url: string,
}

export type UsersPhotosResponse = UserPhoto[]


