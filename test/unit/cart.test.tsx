import React from "react";

import {
  Matcher,
  MatcherOptions,
  render,
  within,
} from "@testing-library/react";
import {
  getCart,
  preparationState,
  makeStore,
  StoreProviderWrapper,
} from "./helpers/store";
import { CartApi, ExampleApi } from "./mocks/api";
import { NavWrapper } from "./helpers/nav";
import { Application } from "../../src/client/Application";
import { CHECHOUT_ID, PRODUCTS, CATALOG } from "./mocks/products";
import { getCartLabel } from "./helpers/helpers";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { clearCart } from "../../src/client/store";

const mockPreloadState = () => {
  return preparationState({
    products: CATALOG,
    details: PRODUCTS[0],
    cart: getCart([PRODUCTS[0], PRODUCTS[1]]),
  });
};

type GetByTestId = (
  id: Matcher,
  options?: MatcherOptions | undefined
) => HTMLElement;

const fillFormAndSubmit = async (
  getByTestId: GetByTestId,
  event: UserEvent,
  { name, phone, address }: { name: string; phone: string; address: string }
) => {
  const form = getByTestId("cartForm");
  await event.type(within(form).getByTestId("name"), name);
  await event.type(within(form).getByTestId("phone"), phone);
  await event.type(within(form).getByTestId("address"), address);

  await event.click(within(form).getByTestId("submit"));

  return {
    name: within(form).getByTestId("name"),
    phone: within(form).getByTestId("phone"),
    address: within(form).getByTestId("address"),
    submit: within(form).getByTestId("submit"),
    form,
  };
};

describe("Страница корзины", () => {
  afterEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it("Товары в шапке должны учитываться без повторений", async () => {
    const fakeStore = makeStore(new ExampleApi(), undefined, {
      preloadedState: mockPreloadState(),
    });

    const { getByTestId } = render(
      NavWrapper(StoreProviderWrapper(<Application />, { store: fakeStore }), {
        initialEntries: ["/cart"],
      })
    );

    const cartLink = getByTestId("cartLink");
    expect(cartLink.textContent).toEqual(getCartLabel(2));
  });

  it("Кнопка для очищения корзины", async () => {
    const buttonEvent = userEvent.setup();
    const fakeStore = makeStore(new ExampleApi(), undefined, {
      preloadedState: mockPreloadState(),
    });

    const { getByTestId } = render(
      NavWrapper(StoreProviderWrapper(<Application />, { store: fakeStore }), {
        initialEntries: ["/cart"],
      })
    );

    const clearShoppingCart = getByTestId("clearShoppingCart");

    //@ts-ignore
    expect(clearShoppingCart).toBeVisible();

    await buttonEvent.click(clearShoppingCart);

    expect(fakeStore.getState().cart).toStrictEqual({});
  });

  it("После оформления заказа форма пропадает", async () => {
    const event = userEvent.setup();
    const fakeStore = makeStore(new ExampleApi(), undefined, {
      preloadedState: mockPreloadState(),
    });

    const { getByTestId } = render(
      NavWrapper(StoreProviderWrapper(<Application />, { store: fakeStore }), {
        initialEntries: ["/cart"],
      })
    );

    const { form } = await fillFormAndSubmit(getByTestId, event, {
      name: "Test name",
      phone: "89015920000",
      address: "Some address",
    });
    //@ts-ignore
    expect(form).not.toBeVisible();
  });

  it("Успешный статус при правильном оформлении заказа", async () => {
    const fakeStore = makeStore(new ExampleApi(), undefined, {
      preloadedState: preparationState({
        products: CATALOG,
        details: PRODUCTS[0],
        cart: [],
        latestOrderId: CHECHOUT_ID,
      }),
    });

    const { findByTestId } = render(
      NavWrapper(StoreProviderWrapper(<Application />, { store: fakeStore }), {
        initialEntries: ["/cart"],
      })
    );
    const alert = await findByTestId("orderAlert");
    //@ts-ignore
    expect(alert).toBeVisible();
    //@ts-ignore
    expect(alert).toHaveClass("alert-success");
  });
});
