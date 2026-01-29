import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import seloSucesso from '../assets/purchase.png'; 

const Finalizacao = () => {
  const navigate = useNavigate();
  const [dados, setDados] = useState({ nome: '', total: 0 });

  useEffect(() => {
    const nomeSalvo = localStorage.getItem('clienteNome');
    const totalSalvo = localStorage.getItem('valorTotal');

    setDados({
      nome: nomeSalvo || 'John Doe',
      total: totalSalvo ? parseFloat(totalSalvo) : 299.00 // Valor exemplo da imagem
    });
  }, []);

  const handleNovaCompra = () => {
    localStorage.removeItem('clienteNome');
    localStorage.removeItem('valorTotal');
    navigate('/');
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <Box 
      sx={{ 
        bgcolor: '#f5f7f9', // Fundo levemente cinza como na imagem
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="xs">
        <Paper 
          elevation={0} 
          sx={{ 
            p: 5, 
            textAlign: 'center', 
            borderRadius: '16px',
            border: '1px solid #e0e0e0' 
          }}
        >
          {/* Nome do Cliente */}
          <Typography 
            variant="h4" 
            sx={{ color: '#455a64', fontWeight: 700, mb: 1 }}
          >
            {dados.nome},
          </Typography>

          {/* Mensagem de Sucesso */}
          <Typography 
            variant="h6" 
            sx={{ color: '#455a64', lineHeight: 1.2, mb: 4 }}
          >
            Sua compra no valor{' '}
            <Box component="span" sx={{ color: '#009fe3', fontWeight: 700 }}>
              {formatarMoeda(dados.total)}
            </Box>
            <br />
            foi finalizada com sucesso
          </Typography>

          {/* Ilustração (Selo com Thumbs Up) */}
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <Box 
              component="img"
              src={seloSucesso} // Use o caminho da sua imagem aqui
              alt="Sucesso"
              sx={{ width: '100%', maxWidth: 250, height: 'auto' }}
            />
          </Box>

          {/* Botão Laranja */}
          <Button 
            variant="contained" 
            onClick={handleNovaCompra}
            sx={{ 
              bgcolor: '#ff9800', 
              color: '#fff',
              fontWeight: 800,
              fontSize: '1rem',
              px: 4,
              py: 1.5,
              borderRadius: '8px',
              textTransform: 'uppercase',
              '&:hover': { bgcolor: '#f57c00' },
              boxShadow: 'none'
            }}
          >
            Iniciar Nova Compra
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Finalizacao;