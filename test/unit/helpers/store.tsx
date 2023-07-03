import React from "react";
import {
  Action,
  ApplicationState,
  EpicDeps,
  rootEpic,
  createRootReducer,
} from "../../../src/client/store";
import { CartItem, CartState, Product } from "../../../src/common/types";
import { Provider } from "react-redux";
import { CartApi, ExampleApi } from "../../../src/client/api";
import { Store, createStore, applyMiddleware, PreloadedState } from "redux";
import constants from "./consts";
import { createEpicMiddleware } from "redux-observable";

export const makeStore = (
  api = new ExampleApi(constants.BASE_NAME),
  cart = new CartApi(),
  { preloadedState }: { preloadedState?: PreloadedState<ApplicationState> } = {}
) => {
  const rootReducer = createRootReducer({
    cart: cart.getState(),
  });

  const epicMiddleware = createEpicMiddleware<
    Action,
    Action,
    ApplicationState,
    EpicDeps
  >({
    dependencies: { api, cart },
  });

  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(epicMiddleware)
  );

  epicMiddleware.run(rootEpic);

  return store;
};

export const StoreProviderWrapper = (
  children: React.ReactChild,
  { store = makeStore() }: { store?: Store } = {}
) => {
  return <Provider store={store}>{children}</Provider>;
};

export const getCart = (products: Product[], count = 1): CartState => {
  const cart: Record<number, CartItem> = {};
  products.forEach((product) => {
    cart[product.id] = {
      name: product.name,
      price: product.price,
      count: count,
    };
  });
  return cart;
};

interface PreparationStateProps {
  cart: ApplicationState["cart"];
  products?: ApplicationState["products"];
  details?: ApplicationState["details"];
  latestOrderId?: ApplicationState["latestOrderId"];
}
export const preparationState = ({
  products,
  details = {},
  cart = {},
  latestOrderId,
}: PreparationStateProps): ApplicationState => {
  return {
    latestOrderId,
    products: products,
    details: details,
    cart: cart,
  };
};
