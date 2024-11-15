import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Cart } from "./user-detail";
import {Injectable} from "@angular/core";

export class AddCart {
  static readonly type = '[Cart] Add Cart';
  constructor(public payload: Cart & { userId: number }) { }
}

export class UpdateCartQuantity {
  static readonly type = '[Cart] Update Cart Quantity';
  constructor(public payload: { id: number, quantity: number, userId: number }) { }
}

export interface CartStateModel {
  carts: { [userId: number]: Cart[] };
}

@State<CartStateModel>({
  name: 'carts',
  defaults: {
    carts: {}
  }
})
@Injectable()
export class CartState {
  @Selector()
  static getCarts(state: CartStateModel) {
    return (userId: number) => {
      const cartItems = state.carts[userId] || [];
      console.log(`Getting carts for userId: ${userId}, found:`, cartItems);
      return cartItems;
    };
  }

  @Action(AddCart)
  addCart(ctx: StateContext<CartStateModel>, action: AddCart) {
    const state = ctx.getState();
    const userId = action.payload.userId;
    const existingCartIndex = state.carts[userId]?.findIndex(cart => cart.id === action.payload.id) ?? -1;

    console.log('Current State before adding:', state); // Лог текущего состояния перед добавлением
    console.log('Adding cart for userId:', userId, 'Cart:', action.payload);

    let updatedCarts;
    if (existingCartIndex !== -1) {
      updatedCarts = [...(state.carts[userId] || [])];
      updatedCarts[existingCartIndex] = {
        ...updatedCarts[existingCartIndex],
        quantity: updatedCarts[existingCartIndex].quantity + action.payload.quantity
      };
    } else {
      updatedCarts = [...(state.carts[userId] || []), action.payload];
    }

    ctx.patchState({
      carts: {
        ...state.carts,
        [userId]: updatedCarts
      }
    });

    console.log('Updated state after AddCart:', ctx.getState()); // Лог обновленного состояния
  }

  @Action(UpdateCartQuantity)
  updateCartQuantity(ctx: StateContext<CartStateModel>, action: UpdateCartQuantity) {
    const state = ctx.getState();
    const userId = action.payload.userId;
    const updatedCarts = state.carts[userId]?.map(cart => {
      if (cart.id === action.payload.id) {
        const newTotal = cart.price * action.payload.quantity;
        return { ...cart, quantity: action.payload.quantity, total: newTotal };
      }
      return cart;
    }) || [];
    ctx.patchState({
      carts: {
        ...state.carts,
        [userId]: updatedCarts
      }
    });
  }
}
