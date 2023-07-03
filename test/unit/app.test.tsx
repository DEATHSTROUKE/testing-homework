import React from "react";
import constants from "./helpers/consts";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Application } from "../../src/client/Application";
import { trimBaseUrl, ProviderWrapper } from "./helpers/helpers";

describe("Общие требования", () => {
  it("Меню гамбургер закрывается при нажатии на ссылку", async () => {
    const buttonEvent = userEvent.setup();

    const { getByLabelText, getByTestId, getAllByRole, container } = render(
      ProviderWrapper(<Application />)
    );

    await buttonEvent.click(getByLabelText("Toggle navigation"));
    //@ts-ignore
    expect(getByTestId("navbar")).not.toHaveClass("collapse");

    const navigationLinks = within(getByTestId("navbar")).getAllByRole("link");

    // Открывает статичную страницу delivery, чтобы не задействовать API
    await buttonEvent.click(navigationLinks[1]);
    //@ts-ignore
    expect(getByTestId("navbar")).toHaveClass("collapse");
  });
});
