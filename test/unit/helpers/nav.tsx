import React from "react";
import { MemoryRouter, MemoryRouterProps } from "react-router-dom";

export const NavWrapper = (
  children: React.ReactChild,
  props: MemoryRouterProps = {}
) => {
  return <MemoryRouter {...props}>{children}</MemoryRouter>;
};
