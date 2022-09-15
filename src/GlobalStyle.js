import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html,
  body,
  #root {
    height: 100%;  
  }
  
  body {
    background-image: radial-gradient(circle, rgba(158,14,14,1) 0%, rgba(80,1,1,1) 100%);;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
  }
`;

export default GlobalStyle;