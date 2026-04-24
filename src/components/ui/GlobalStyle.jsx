import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "ModernMuseum";
    src: url("/src/assets/fonts/MuseoModerno1.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
  }

  :root {
    --font-main: "Inter", sans-serif;
    --font-title: "ModernMuseum", sans-serif;
    -webkit-tap-highlight-color: transparent;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    background-color: #f3f4f6;
    font-family: var(--font-main);
  }
`;