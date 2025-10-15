import {  createTheme } from '@mantine/core';
import classes from './theme.module.css';
const theme = createTheme({
  components: {
    Button: {
      classNames: classes
    }
  },
  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "88em",
  },
  colors: {
    brand: [
      "#e6f7ff",
      "#bae7ff",
      "#91d5ff",
      "#69c0ff",
      "#40a9ff",
      "#1890ff",
      "#096dd9",
      "#0050b3",
      "#003a8c",
      "#002766",
    ],
  }
});
export default theme;
