import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* 🔤 Fuente personalizada */
  @font-face {
    font-family: "ModernMuseum";
    src: url("/src/assets/fonts/MuseoModerno1.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
  }

  /* 🎯 Variables globales */
  :root {
    --font-main: "Inter", sans-serif;
    --font-title: "ModernMuseum", sans-serif;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    background-color: #f3f4f6;
    font-family: var(--font-main);
  }
`;