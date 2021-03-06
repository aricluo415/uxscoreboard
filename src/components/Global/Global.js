import React from 'react'
import { Global as GlobalStyles, css } from '@emotion/core'

const Global = () => (
  <GlobalStyles
    styles={theme => css`
      * {
        margin: 0;
        padding: 0;
      }
      html,
      body {
        height: 100%;
        box-sizing: border-box;
      }
      *,
      ::before,
      *::after {
        box-sizing: inherit;
      }
      img {
        max-width: 100%;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
      ul,
      menu {
        list-style-type: none;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: inherit;
      }
      strong {
        font-weight: 700;
      }
      figure {
        text-align: center;
      }
      figcaption {
        font-size: 0.9em;
      }
      table,
      hr {
        border: 0;
      }
      nav,
      menu {
        letter-spacing: 0;
      }
      sup {
        font-size: 66%;
      }

      body {
        background: ${theme.colors.grey[3]};
        color: ${theme.colors.grey[8]};
        font: 400 16px/1.45 'Avenir Next', Avenir, 'Segoe UI', Roboto,
          'Helvetica Neue', sans-serif;
        letter-spacing: 1px;
        transition: opacity 0.44s 0.66s;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -webkit-tap-highlight-color: transparent;
        -moz-osx-font-smoothing: grayscale;
      }
      #root {
        height: 100%;
        font-family: 'Comfortaa', cursive;
      }
    `}
  />
)

export default Global
