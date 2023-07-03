import {
  getCart,
  preparationState,
  makeStore,
  StoreProviderWrapper,
} from "./helpers/store";
import React from "react";
import { PRODUCTS, CATALOG } from "./mocks/products";
import { render, waitFor, screen } from "@testing-library/react";
import { formatPrice, trimBaseUrl } from "./helpers/helpers";
import { NavWrapper } from "./helpers/nav";
import { Application } from "../../src/client/Application";
import { ExampleApi } from "./mocks/api";
import userEvent from "@testing-library/user-event";
import { Catalog } from "../../src/client/pages/Catalog";

const mockSinglePreloadState = () => {
  return preparationState({
    products: CATALOG,
    details: PRODUCTS[0],
    cart: getCart([PRODUCTS[0]]),
  });
};

describe("Страница каталога", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it("В каталоге должны отображаться товары, которые приходят с сервера", async () => {
    const fakeStore = makeStore(new ExampleApi());

    const { getByTestId } = render(
      NavWrapper(StoreProviderWrapper(<Catalog />, { store: fakeStore }))
    );

    const catalogItemsContainer = await getByTestId("catalog-items");
    await waitFor(() => {
      expect(catalogItemsContainer.childElementCount).toBe(CATALOG.length);
    });
  });

  it("Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async () => {
    const fakeStore = makeStore(new ExampleApi());

    const { findByTestId } = render(
      NavWrapper(StoreProviderWrapper(<Catalog />, { store: fakeStore }))
    );

    const catalogItemsContainer = (await findByTestId(
      "catalog-items"
    )) as HTMLDivElement;

    Array.prototype.forEach.call(
      catalogItemsContainer.children,
      (cart: HTMLDivElement, i: number) => {
        const product = CATALOG[i];

        const name = cart.querySelector(
          '[data-testid="name"]'
        ) as HTMLHeadingElement;
        expect(name.textContent).toEqual(product.name);

        const price = cart.querySelector(
          '[data-testid="price"]'
        ) as HTMLParagraphElement;

        expect(price.textContent).toEqual(`\$${product.price}`);

        const link = cart.querySelector(
          '[data-testid="link"]'
        ) as HTMLLinkElement;

        expect(trimBaseUrl(link.href)).toEqual(`/catalog/${product.id}`);
      }
    );
  });

  it("Если товар уже добавлен в корзину, в каталоге должно отображаться сообщение об этом", async () => {
    const fakeStore = makeStore(new ExampleApi(), undefined, {
      preloadedState: mockSinglePreloadState(),
    });

    const { findByTestId } = render(
      NavWrapper(StoreProviderWrapper(<Application />, { store: fakeStore }), {
        initialEntries: [`/catalog`],
      })
    );

    const itemInCart = await findByTestId("itemInCart");
    //@ts-ignore
    expect(itemInCart).toBeVisible();
  });

  it("Если товар уже добавлен в корзину, на странице товара должно отображаться сообщение об этом", async () => {
    const product = PRODUCTS[0];

    const fakeStore = makeStore(new ExampleApi(), undefined, {
      preloadedState: mockSinglePreloadState(),
    });

    const { findByTestId } = render(
      NavWrapper(StoreProviderWrapper(<Application />, { store: fakeStore }), {
        initialEntries: [`/catalog/${product.id}`],
      })
    );

    const itemInCart = await findByTestId("itemInCart");
    //@ts-ignore
    expect(itemInCart).toBeVisible();
  });

  it("Если товар есть в корзине, то добавление его в корзину увеличит количество", async () => {
    const buttonEvent = userEvent.setup();

    const product = PRODUCTS[0];

    const fakeStore = makeStore(new ExampleApi(), undefined, {
      preloadedState: mockSinglePreloadState(),
    });

    const { findByTestId } = render(
      NavWrapper(StoreProviderWrapper(<Application />, { store: fakeStore }), {
        initialEntries: [`/catalog/${product.id}`],
      })
    );

    const addToCartButton = await findByTestId("addToCart");

    await buttonEvent.click(addToCartButton);

    expect(fakeStore.getState().cart[product.id].count).toEqual(2);
  });
});
