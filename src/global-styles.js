import React from "react";
import { createGlobalStyle } from "styled-components";
import tw, { GlobalStyles } from "twin.macro";

const GlobalStyle = createGlobalStyle({
  ":root": tw`font-serif bg-gray-600 h-full m-0 p-0`,
  body: tw`h-full`
});

export default () => (
  <>
    <GlobalStyles />
    <GlobalStyle />
  </>
);
