import React from 'react';
import { hot } from 'react-hot-loader';
import {
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './mainRouter';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757de8',
      main: '#3f51b5',
      dark: '#002984',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff79b0',
      main: '#ff4081',
      dark: '#c60055',
      contrastText: '#000',
    },
    openTitle: indigo['400'],
    protectedTitle: pink['400'],
    type: 'light',
  },
});

function App() {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <MainRouter />
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

export default hot(module)(App);
