import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Divider, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const Historico = () => {
  const [compras, setCompras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Carrega o histórico salvo no localStorage
    const dadosSalvos = JSON.parse(localStorage.getItem('historicoCompras') || '[]');
    setCompras(dadosSalvos);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#455a64' }}>
          Meus Pedidos
        </Typography>
        <Button onClick={() => navigate('/')} variant="outlined">Voltar à Loja</Button>
      </Box>

      {compras.length === 0 ? (
        <Typography sx={{ textAlign: 'center', mt: 10, color: 'text.secondary' }}>
          Você ainda não realizou nenhuma compra.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {compras.map((compra) => (
            <Paper 
              key={compra.id} 
              elevation={0} 
              sx={{ p: 3, borderRadius: '12px', border: '1px solid #eceff1' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Pedido #{compra.id} • {compra.data}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', px: 1, borderRadius: 1, fontWeight: 'bold' }}
                >
                  CONCLUÍDO
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                <ShoppingBagIcon sx={{ color: '#009fe3' }} />
                <Box>
                  <Typography fontWeight={600}>{compra.itens}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pagamento via: {compra.metodo?.toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Total:</Typography>
                <Typography variant="h6" fontWeight={700} color="#455a64">
                  R$ {compra.total.toFixed(2).replace('.', ',')}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default Historico;