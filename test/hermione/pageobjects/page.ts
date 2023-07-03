import constants from "../helpers";

export default class Page {
  constructor(public browser: WebdriverIO.Browser) {}

  open(path: string) {
    return this.browser.url(`${constants.BASE_NAME}${path}`);
  }
}
