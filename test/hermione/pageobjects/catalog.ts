import Page from "./page";

export default class Catalog extends Page {
  async getProductCard(productId: number) {
    const productCard = await this.browser.$(`[data-testid="${productId}"]`);

    return {
      name: await productCard.$('[data-testid="name"]'),
      price: await productCard.$('[data-testid="price"]'),
      link: await productCard.$('[data-testid="link"]'),
    };
  }

  open() {
    return super.open("/catalog");
  }
}
