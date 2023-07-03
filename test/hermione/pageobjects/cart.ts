import Page from "./page";

export interface CartProps {
  name: string;
  phone: string;
  address: string;
}

export default class Cart extends Page {
  get name() {
    return this.browser.$('[data-testid="name"]');
  }

  get phone() {
    return this.browser.$('[data-testid="phone"]');
  }

  get address() {
    return this.browser.$('[data-testid="address"]');
  }

  get submit() {
    return this.browser.$('[data-testid="submit"]');
  }

  get orderID() {
    return this.browser.$('[data-testid="orderID"]');
  }

  async sendForm(fields: CartProps) {
    await this.name.addValue(fields.name);
    await this.phone.addValue(fields.phone);
    await this.address.addValue(fields.address);
    await this.submit.click();
  }

  open() {
    return super.open(`/cart`);
  }
}
