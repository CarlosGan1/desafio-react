import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Box, Typography, Container } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import StorefrontIcon from '@mui/icons-material/Storefront'; // Ícone para a logo
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [quantidadeTotal, setQuantidadeTotal] = useState(0);

  const sincronizarCarrinho = () => {
    try {
      const dados = localStorage.getItem('carrinhoSelecionado');
      if (dados) {
        const carrinho = JSON.parse(dados);
        const total = Object.values(carrinho).reduce((acc, qtd) => acc + (Number(qtd) || 0), 0);
        setQuantidadeTotal(total);
      } else {
        setQuantidadeTotal(0);
      }
    } catch (error) {
      console.error("Erro ao ler carrinho:", error);
      setQuantidadeTotal(0);
    }
  };

  useEffect(() => {
    sincronizarCarrinho();
    window.addEventListener('storage', sincronizarCarrinho);
    window.addEventListener('cart-updated', sincronizarCarrinho);

    return () => {
      window.removeEventListener('storage', sincronizarCarrinho);
      window.removeEventListener('cart-updated', sincronizarCarrinho);
    };
  }, []);

  return (
    <Box sx={{ 
      borderBottom: '1px solid #e0e0e0', 
      bgcolor: '#fff',
      py: 1.5 
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* LOGO À ESQUERDA (CONFORME O PRINT) */}
          <Box 
            onClick={() => navigate('/')}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              cursor: 'pointer' 
            }}
          >
            <StorefrontIcon sx={{ color: '#009fe3', fontSize: 28 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#009fe3', 
                fontWeight: 900, 
                letterSpacing: -0.5,
                fontSize: '1.25rem' 
              }}
            >
              LOJA X-BRAIN
            </Typography>
          </Box>

          {/* ICONES À DIREITA */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 4 } }}>
            
            <Box 
              onClick={() => navigate('/historico')}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5, 
                cursor: 'pointer', 
                color: '#455a64', 
                opacity: 0.8,
                '&:hover': { opacity: 1 }
              }}
            >
              <HistoryIcon sx={{ fontSize: 20 }} />
              <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
                PEDIDOS
              </Typography>
            </Box>

            <IconButton onClick={() => navigate('/carrinho')} sx={{ color: '#455a64' }}>
              <Badge 
                badgeContent={quantidadeTotal} 
                showZero={false}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#d32f2f', 
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    height: '18px',
                    minWidth: '18px',
                  }
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: 26 }} />
              </Badge>
            </IconButton>
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

export default Header;