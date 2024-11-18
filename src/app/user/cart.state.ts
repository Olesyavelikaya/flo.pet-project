import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { CartItem } from './user-detail';

export class AddCart {
  static readonly type = '[Cart] Add Cart';
  constructor(public payload: CartItem & { userId: number }) {}
}

export class UpdateCartQuantity {
  static readonly type = '[Cart] Update Cart Quantity';
  constructor(
    public payload: { id: number; quantity: number; userId: number },
  ) {}
}

export class FetchAllCarts {
  static readonly type = '[Cart] Fetch All Carts';
  constructor(public payload: { userId: number; carts: CartItem[] }) {}
}

export interface CartStateModel {
  carts: { [userId: number]: CartItem[] };
}

@State<CartStateModel>({
  name: 'carts',
  defaults: {
    carts: {},
  },
})
@Injectable()
export class CartState {
  @Selector()
  static getCarts(state: CartStateModel) {
    return (userId: number) => {
      return state.carts[userId] || [];
    };
  }

  @Action(AddCart)
  addCart(ctx: StateContext<CartStateModel>, action: AddCart) {
    const state = ctx.getState();
    const userId = action.payload.userId;
    const existingCartIndex =
      state.carts[userId]?.findIndex((cart) => cart.id === action.payload.id) ??
      -1;

    let updatedCarts;
    if (existingCartIndex !== -1) {
      updatedCarts = [...(state.carts[userId] || [])];
      updatedCarts[existingCartIndex] = {
        ...updatedCarts[existingCartIndex],
        quantity:
          updatedCarts[existingCartIndex].quantity + action.payload.quantity,
      };
    } else {
      updatedCarts = [...(state.carts[userId] || []), action.payload];
    }
    ctx.patchState({
      carts: {
        ...state.carts,
        [userId]: updatedCarts,
      },
    });
  }

  @Action(UpdateCartQuantity)
  updateCartQuantity(
    ctx: StateContext<CartStateModel>,
    action: UpdateCartQuantity,
  ) {
    const state = ctx.getState();
    const userId = action.payload.userId;
    const updatedCarts =
      state.carts[userId]?.map((cart) => {
        if (cart.id === action.payload.id) {
          const newTotal = cart.price * action.payload.quantity;
          return {
            ...cart,
            quantity: action.payload.quantity,
            total: newTotal,
          };
        }
        return cart;
      }) || [];
    ctx.patchState({
      carts: {
        ...state.carts,
        [userId]: updatedCarts,
      },
    });
  }

  @Action(FetchAllCarts)
  fetchAllCarts(ctx: StateContext<CartStateModel>, action: FetchAllCarts) {
    const state = ctx.getState();
    const userId = action.payload.userId;

    const existingCarts = state.carts[userId] || [];
    const newCarts = action.payload.carts.map((cart) => {
      const existingCartIndex = existingCarts.findIndex(
        (c) => c.id === cart.id,
      );

      if (existingCartIndex !== -1) {
        const updatedCart = {
          ...existingCarts[existingCartIndex],
          quantity: cart.quantity,
        };
        return updatedCart;
      } else {
        return cart;
      }
    });

    ctx.patchState({
      carts: {
        ...state.carts,
        [userId]: newCarts,
      },
    });
  }
}
