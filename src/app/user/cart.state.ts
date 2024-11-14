import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Cart } from "./user-detail";
import {Injectable} from "@angular/core";

export class AddCart {
  static readonly type = '[Cart] Add Cart';
  constructor(public payload: Cart) { }
}

export class UpdateCartQuantity {
  static readonly type = '[Cart] Update Cart Quantity';
  constructor(public payload: { id: number, quantity: number }) { }
}

export interface CartStateModel {
  carts: Cart[];
}

@State<CartStateModel>({
  name: 'carts',
  defaults: {
    carts: []
  }
})
@Injectable()
export class CartState {
  @Selector()
  static getCarts(state: CartStateModel) {
    return state.carts;
  }

  @Action(AddCart)
  addCart(ctx: StateContext<CartStateModel>, action: AddCart) {
    const state = ctx.getState();
    const existingCartIndex = state.carts.findIndex(cart => cart.id === action.payload.id);
    if (existingCartIndex !== -1) {
      const updatedCarts = [...state.carts];
      updatedCarts[existingCartIndex] = {
        ...updatedCarts[existingCartIndex],
        quantity: updatedCarts[existingCartIndex].quantity + action.payload.quantity
      };
      ctx.patchState({
        carts: updatedCarts
      });
    } else {
      ctx.patchState({
        carts: [...state.carts, action.payload]
      });
    }
  }

  @Action(UpdateCartQuantity)
  updateCartQuantity(ctx: StateContext<CartStateModel>, action: UpdateCartQuantity) {
    const state = ctx.getState();
    const updatedCarts = state.carts.map(cart => {
      if (cart.id !== undefined && cart.id === action.payload.id && cart.price !== undefined) {
        const newTotal = cart.price * action.payload.quantity;
        return { ...cart, quantity: action.payload.quantity, total: newTotal };
      }
      return cart;
    });
    ctx.patchState({
      carts: updatedCarts
    });
  }
}
