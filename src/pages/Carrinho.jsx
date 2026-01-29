import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, IconButton, Container, Paper, Divider, Badge 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const listaProdutos = [
  { id: 1, nome: 'AirPods Apple Fones de ouvido', preco: 1499, img: '/src/assets/produto-01.jpeg' },
  { id: 2, nome: 'Capa MagSafe para iPhone 13 Pro', preco: 299, img: '/src/assets/produto-02.jpeg' },
  { id: 3, nome: 'Apple Pencil', preco: 729, img: '/src/assets/produto-03.jpeg' },
  { id: 4, nome: 'Magic Mouse 2 - Prateado', preco: 549, img: '/src/assets/produto-04.jpeg' },
  { id: 5, nome: 'Apple Watch prateado', preco: 2899, img: '/src/assets/produto-05.jpeg' },
  { id: 6, nome: 'Cabo de Lightning para USB (1 m)', preco: 149, img: '/src/assets/produto-06.jpeg' },
  { id: 7, nome: 'Smart Keyboard para iPad Pro', preco: 1099, img: '/src/assets/produto-07.jpeg' },
  { id: 8, nome: 'Carregador USB-C de 20W', preco: 149, img: '/src/assets/produto-08.jpeg' }
];

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

const Carrinho = () => {
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState(() => {
    const salvo = localStorage.getItem('carrinhoSelecionado');
    return salvo ? JSON.parse(salvo) : {};
  });

  useEffect(() => {
    localStorage.setItem('carrinhoSelecionado', JSON.stringify(carrinho));
    const total = listaProdutos.reduce((acc, p) => acc + p.preco * (carrinho[p.id] || 0), 0);
    localStorage.setItem('valorTotal', total);
    
    window.dispatchEvent(new Event('cart-updated'));
  }, [carrinho]);

  const totalGeral = listaProdutos.reduce((acc, p) => acc + p.preco * (carrinho[p.id] || 0), 0);

  const ajustarQtdNoCarrinho = (id, delta) => {
    setCarrinho((prev) => {
      const novaQtd = (prev[id] || 0) + delta;
      const novoCarrinho = { ...prev };
      if (novaQtd <= 0) {
        delete novoCarrinho[id];
      } else {
        novoCarrinho[id] = novaQtd;
      }
      return novoCarrinho;
    });
  };

  const temItens = Object.keys(carrinho).length > 0;

  return (
    <Container maxWidth="md" sx={{ py: 3, bgcolor: 'transparent' }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #f0f0f0', bgcolor: 'transparent' }}>
        
        {/* HEADER DO CARRINHO SEM O NÚMERO (BADGE REMOVIDO) */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <ShoppingCartCheckoutIcon sx={{ fontSize: 30, color: '#455a64' }} />
          <Typography variant="h5" fontWeight={700} sx={{ color: '#455a64' }}>
            Seu Carrinho
          </Typography>
        </Box>

        {!temItens ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
              Seu carrinho está vazio.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')} 
              sx={{ textTransform: 'none', borderRadius: '12px', fontWeight: 600 }}
            >
              Voltar para a loja
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              {listaProdutos.filter(p => carrinho[p.id] > 0).map(item => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, borderBottom: '1px solid #f5f5f5' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img src={item.img} style={{ width: 60, height: 60, objectFit: 'contain' }} alt={item.nome} />
                    <Box>
                      <Typography variant="body1" fontWeight={600} sx={{ color: '#455a64' }}>{item.nome}</Typography>
                      <Typography variant="body2" color="textSecondary">{formatarMoeda(item.preco)}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 4 } }}>
                    {/* CONTROLES DE QUANTIDADE */}
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#fff' }}>
                      <IconButton size="small" onClick={() => ajustarQtdNoCarrinho(item.id, -1)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ px: 1.5, fontSize: '0.9rem', fontWeight: 700 }}>
                        {carrinho[item.id]}
                      </Typography>
                      <IconButton size="small" onClick={() => ajustarQtdNoCarrinho(item.id, 1)}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography variant="body1" fontWeight={700} sx={{ minWidth: 100, textAlign: 'right', color: '#009fe3' }}>
                      {formatarMoeda(item.preco * carrinho[item.id])}
                    </Typography>

                    <IconButton onClick={() => ajustarQtdNoCarrinho(item.id, -carrinho[item.id])} sx={{ color: '#ffcdd2', '&:hover': { color: '#d32f2f' } }}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* RESUMO E BOTÕES - ESTILO SUTIL */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pt: 3, borderTop: '2px solid #f5f5f5' }}>
              <Typography variant="body2" sx={{ color: '#90a4ae', mb: 0.5 }}>Total do pedido:</Typography>
              <Typography variant="h3" fontWeight={700} sx={{ color: '#009fe3', mb: 4 }}>
                {formatarMoeda(totalGeral)}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
                <Button 
                  variant="text" 
                  onClick={() => navigate('/')} 
                  sx={{ color: '#78909c', fontWeight: 600, textTransform: 'none' }}
                >
                  Continuar comprando
                </Button>
                <Button 
                  variant="contained" 
                  disableElevation
                  onClick={() => navigate('/checkout')} 
                  sx={{ 
                    bgcolor: '#ffa726', 
                    fontWeight: 700, 
                    px: 5, 
                    py: 1.5, 
                    borderRadius: '12px', 
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#fb8c00' } 
                  }}
                >
                  Ir para pagamento
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Carrinho;