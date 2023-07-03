import { StoreProviderWrapper } from "./store";
import { NavWrapper } from "./nav";
import constants from "./consts";

export const ProviderWrapper = (children: React.ReactChild) => {
  return NavWrapper(StoreProviderWrapper(children));
};

export const getCartLabel = (quantity: number) => {
  return quantity > 0 ? `Cart (${quantity})` : "Cart";
};

export const trimBaseUrl = (path: string) => {
  return path.replace(constants.BASE_URL, "");
};

export const formatPrice = (price: number) => {
  return `\$${price}`;
};

export const toResponseData = <T>({
                                    data,
                                    status = 200,
                                  }: {
  data: T;
  status?: number;
}) => {
  return {
    status,
    data,
  };
};

