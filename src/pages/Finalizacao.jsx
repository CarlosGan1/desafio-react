import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Finalizacao = () => {
  const navigate = useNavigate();
  const [dados, setDados] = useState({ nome: '', total: 0 });

  useEffect(() => {
    // 1. Recupera os dados salvos no passo anterior
    const nomeSalvo = localStorage.getItem('clienteNome');
    const totalSalvo = localStorage.getItem('valorTotal');

    // Se não tiver dados (usuário tentou acessar direto), define valores padrão
    setDados({
      nome: nomeSalvo || 'Cliente',
      total: totalSalvo ? parseFloat(totalSalvo) : 0
    });
  }, []);

  const handleNovaCompra = () => {
    // 2. Limpa o "carrinho" (localStorage) antes de voltar
    localStorage.removeItem('clienteNome');
    localStorage.removeItem('valorTotal');
    
    // 3. Redireciona para o início
    navigate('/');
  };

  // Função auxiliar para formatar dinheiro (R$)
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Compra Realizada com Sucesso!
        </Typography>
        
        <Box sx={{ my: 3 }}>
          <Typography variant="h6" color="text.secondary">
            Obrigado pela preferência,
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {dados.nome}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1">
            Valor total da compra:
          </Typography>
          <Typography variant="h3" color="success.main" fontWeight="bold">
            {formatarMoeda(dados.total)}
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          color="secondary" 
          size="large" 
          onClick={handleNovaCompra}
          fullWidth
        >
          Iniciar Nova Compra
        </Button>
      </Paper>
    </Container>
  );
};

export default Finalizacao;