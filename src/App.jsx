import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Produto from './pages/Produto';
import Finalizacao from './pages/Finalizacao';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Produto />} />
          <Route path="/checkout" element={<Finalizacao />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;