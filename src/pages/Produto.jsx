import React, { useState, useEffect } from 'react';
import { reduxForm } from 'redux-form';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  Divider,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';

import produto01 from '../assets/produto-01.jpeg';
import produto02 from '../assets/produto-02.jpeg';
import produto03 from '../assets/produto-03.jpeg';
import produto04 from '../assets/produto-04.jpeg';
import produto05 from '../assets/produto-05.jpeg';
import produto06 from '../assets/produto-06.jpeg';
import produto07 from '../assets/produto-07.jpeg';
import produto08 from '../assets/produto-08.jpeg';

const listaProdutos = [
  { id: 1, nome: 'AirPods Apple Fones de ouvido', preco: 1499, img: produto01 },
  { id: 2, nome: 'Capa MagSafe para iPhone 13 Pro', preco: 299, img: produto02 },
  { id: 3, nome: 'Apple Pencil', preco: 729, img: produto03 },
  { id: 4, nome: 'Magic Mouse 2 - Prateado', preco: 549, img: produto04 },
  { id: 5, nome: 'Caixa prateada de alumínio com pulseira esportiva branca', preco: 2899, img: produto05 },
  { id: 6, nome: 'Cabo de Lightning para USB (1 m)', preco: 149, img: produto06 },
  { id: 7, nome: 'Smart Keyboard para iPad Pro 12,9 polegadas - inglês (EUA)', preco: 1099, img: produto07 },
  { id: 8, nome: 'Carregador USB-C de 20W da Apple', preco: 149, img: produto08 }
];

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);

let ProdutoForm = ({ handleSubmit }) => {
  const navigate = useNavigate();

  const [quantidades, setQuantidades] = useState({});
  const [carrinho, setCarrinho] = useState({});
  const [produtoAtivo, setProdutoAtivo] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [openSnack, setOpenSnack] = useState(false);

  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!e.target.closest('[data-card-produto="true"]')) {
        setProdutoAtivo(null);
      }
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  useEffect(() => {
    const salvo = localStorage.getItem('carrinhoSelecionado');
    if (salvo) setCarrinho(JSON.parse(salvo));
  }, []);

  const confirmarAdicao = (id) => {
    const qtdTemporaria = quantidades[id] || 0;
    if (qtdTemporaria > 0) {
      setCarrinho((prev) => {
        const novoCarrinho = { ...prev, [id]: (prev[id] || 0) + qtdTemporaria };
        localStorage.setItem('carrinhoSelecionado', JSON.stringify(novoCarrinho));
        window.dispatchEvent(new Event('cart-updated'));
        return novoCarrinho;
      });
      setQuantidades((prev) => ({ ...prev, [id]: 0 }));
      setProdutoAtivo(null);
      setOpenSnack(true);
    }
  };

  const aoEnviar = () => {
    if (totalGeral === 0) {
      alert('Selecione pelo menos um produto!');
      return;
    }
    localStorage.setItem('carrinhoSelecionado', JSON.stringify(carrinho));
    localStorage.setItem('valorTotal', totalGeral);
    window.dispatchEvent(new Event('cart-updated'));
    navigate('/checkout');
  };

  const totalGeral = listaProdutos.reduce(
    (acc, p) => acc + p.preco * (carrinho[p.id] || 0),
    0
  );

  const produtosFiltrados = listaProdutos.filter((p) =>
    p.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const alterarQtd = (id, delta) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 15 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color: '#333' }}>Produtos</Typography>
        <TextField
          size="small"
          placeholder="Pesquisar acessório Apple..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          sx={{ width: 280 }}
        />
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* GRADE DE PRODUTOS */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 250px)'
          },
          gap: 6,
          justifyContent: 'center'
        }}
      >
        {produtosFiltrados.slice(0, 8).map((p) => {
          const selecionado = produtoAtivo === p.id;

          return (
            <Box
              key={p.id}
              data-card-produto="true"
              onClick={(e) => {
                e.stopPropagation();
                setProdutoAtivo(p.id);
              }}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start', // AJUSTE: Alinha o conteúdo à esquerda
                textAlign: 'left',        // AJUSTE: Texto alinhado à esquerda
                borderRadius: '12px',
                border: selecionado ? '1px solid #009fe3' : '1px solid transparent',
                boxShadow: selecionado ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
                transition: '0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: selecionado ? 'transparent' : '#fafafa'
                }
              }}
            >
              {/* IMAGEM (Mantida centralizada no card) */}
              <Box sx={{ mb: 3, height: 160, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={p.img}
                  alt={p.nome}
                  style={{ width: '100%', maxHeight: 150, objectFit: 'contain' }}
                />
              </Box>

              {/* INFORMAÇÕES DO PRODUTO */}
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" sx={{ color: '#546e7a', mb: 2, minHeight: 40, lineHeight: 1.4 }}>
                  {p.nome}
                </Typography>

                <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
                  {formatarMoeda(p.preco)}
                </Typography>

                <Typography variant="caption" sx={{ color: '#90a4ae', display: 'block' }}>
                  Em até 12x de {formatarMoeda(p.preco / 12)}
                </Typography>

                {/* TEXTO DO DESCONTO ALINHADO À ESQUERDA */}
                <Typography variant="caption" sx={{ color: '#b0bec5', fontWeight: 500, display: 'block' }}>
                  {formatarMoeda(p.preco * 0.9)} à vista (10% de desconto)
                </Typography>
              </Box>

              {/* BOTÕES DE AÇÃO */}
              {selecionado && (
                <Box sx={{ mt: 3, width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, border: '1px solid #f0f0f0', borderRadius: '8px', p: 0.5 }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); alterarQtd(p.id, -1); }}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography fontWeight={700} sx={{ alignSelf: 'center' }}>
                      {quantidades[p.id] || 0}
                    </Typography>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); alterarQtd(p.id, 1); }}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    disableElevation
                    sx={{ bgcolor: '#009fe3', fontWeight: 700, borderRadius: '6px', textTransform: 'none' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmarAdicao(p.id);
                    }}
                  >
                    Adicionar
                  </Button>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {/* FINALIZAR COMPRA */}
      <Box sx={{ mt: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={aoEnviar}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: '#ff9800',
            height: 55,
            px: 6,
            fontSize: '1rem',
            fontWeight: 800,
            borderRadius: '30px',
            textTransform: 'none',
            '&:hover': { bgcolor: '#f57c00' }
          }}
        >
          Finalizar compra
        </Button>
      </Box>

      <Snackbar
        open={openSnack}
        autoHideDuration={2000} 
        onClose={() => setOpenSnack(false)}
        message="Produto adicionado com sucesso!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

ProdutoForm = reduxForm({ form: 'produtoForm' })(ProdutoForm);
export default ProdutoForm;