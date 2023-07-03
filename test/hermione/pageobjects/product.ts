import productFixture from "../__fixtures__/productResponse.json" assert { type: "json" };
import Page from "./page";

export default class Product extends Page {
  get addToCart() {
    return this.browser.$('[data-testid="addToCart"]');
  }

  get name() {
    return this.browser.$('[data-testid="name"]');
  }

  get description() {
    return this.browser.$('[data-testid="name"]');
  }

  get price() {
    return this.browser.$('[data-testid="name"]');
  }

  get productContainer() {
    return this.browser.$(".Product");
  }

  addProductToCart() {
    return this.addToCart.click();
  }

  open(productId: string) {
    return super.open(`/catalog/${productId}`);
  }

  async mockProductResponse(productId: string) {
    const productMock = await this.browser.mock(`**/api/products/${productId}`);

    productMock.respond(productFixture, {
      fetchResponse: false,
    });
  }
}
