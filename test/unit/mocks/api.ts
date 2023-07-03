import { toResponseData } from "../helpers/helpers";
import { getCart } from "../helpers/store";
import {
  PRODUCTS,
  CATALOG,
  CHECHOUT_ID,
} from "./products";

const findProduct = (id: number) =>
  PRODUCTS.find((product) => product.id === id) ?? null;

const ExampleApi = jest.fn().mockImplementation(() => {
  return {
    getProducts: jest
      .fn()
      .mockResolvedValue(toResponseData({ data: CATALOG })),
    getProductById: (id: number) =>
      Promise.resolve(
        toResponseData({
          data: findProduct(id),
        })
      ),
    checkout: jest
      .fn()
      .mockResolvedValue(
        toResponseData({ data: { id: CHECHOUT_ID } })
      ),
  };
});

const CartApi = jest.fn().mockImplementation((initObject) => {
  let object = initObject || {};

  return {
    getState: jest.fn(() => object),
    setState: jest.fn((cart) => (object = cart)),
  };
});

export { ExampleApi, CartApi };
