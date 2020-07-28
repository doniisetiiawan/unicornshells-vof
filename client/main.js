/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { hydrate } from 'react-dom';
import App from './app';

hydrate(<App />, document.getElementById('root'));
