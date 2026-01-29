import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'; // IMPORTANTE
import store from './store'; // Certifique-se de que o caminho do seu store está certo
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Header from "./pages/Header"; 
import Produto from "./pages/Produto";
import Finalizacao from "./pages/Finalizacao";
import Historico from "./pages/Historico";
import Carrinho from "./pages/Carrinho";

const theme = createTheme();

function App() {
  return (
    <Provider store={store}> {/* O Redux precisa envolver tudo */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header /> 
          <Routes>
            <Route path="/" element={<Produto />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/checkout" element={<Finalizacao />} />
            <Route path="/historico" element={<Historico />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;