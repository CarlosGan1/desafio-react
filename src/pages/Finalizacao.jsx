import React, { useState } from 'react';
import { 
  Box, Typography, Divider, Grid, Button, 
  Container, Paper, TextField, MenuItem 
} from '@mui/material';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import seloSucesso from '../assets/purchase.png'; 

// 1. Renderizador de Campo de Texto Sutil
const renderTextField = ({ input, label, placeholder, meta: { touched, error }, ...custom }) => (
  <TextField
    fullWidth
    label={label}
    placeholder={placeholder}
    variant="outlined"
    error={touched && !!error}
    helperText={touched && error}
    InputLabelProps={{ shrink: true }}
    {...input}
    {...custom}
    sx={{ 
      mb: 1, 
      '& .MuiOutlinedInput-root': { 
        bgcolor: 'transparent',
        '& fieldset': { borderColor: '#e0e0e0' }, 
      } 
    }}
  />
);

// 2. Renderizador de Select
const renderSelectField = ({ input, label, children, meta: { touched, error } }) => (
  <TextField
    fullWidth
    select
    label={label}
    variant="outlined"
    error={touched && !!error}
    helperText={touched && error}
    InputLabelProps={{ shrink: true }}
    {...input}
    SelectProps={{ displayEmpty: true }}
    sx={{ 
      mb: 1,
      '& .MuiOutlinedInput-root': { 
        bgcolor: 'transparent',
        '& fieldset': { borderColor: '#e0e0e0' },
      }
    }}
  >
    {children}
  </TextField>
);

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);

let Finalizacao = (props) => {
  const { handleSubmit, submitting } = props;
  const [compraFinalizada, setCompraFinalizada] = useState(false);
  const navigate = useNavigate();
  
  // Captura os valores do formulário para usar o nome na tela de sucesso
  const formValues = useSelector(state => getFormValues('checkoutForm')(state));

  const valorTotalSalvo = parseFloat(localStorage.getItem('valorTotal')) || 0;
  const carrinho = JSON.parse(localStorage.getItem('carrinhoSelecionado') || '{}');

  const aoEnviar = (values) => {
    const historicoAtual = JSON.parse(localStorage.getItem('historicoCompras') || '[]');
    const novaCompra = {
      id: Math.floor(Math.random() * 10000),
      data: new Date().toLocaleDateString('pt-BR'),
      total: valorTotalSalvo,
      metodo: values.pagamento,
      itens: Object.keys(carrinho).length + " item(ns) selecionado(s)",
      cliente: values.nome
    };

    localStorage.setItem('historicoCompras', JSON.stringify([novaCompra, ...historicoAtual]));
    setCompraFinalizada(true);
  };

  // --- TELA DE SUCESSO (ESTILO IMAGEM) ---
  if (compraFinalizada) {
    const primeiroNome = formValues?.nome?.split(' ')[0] || "Cliente";

    return (
      <Container maxWidth="xs" sx={{ mt: 10, textAlign: 'center' }}>
        <Box sx={{ p: 4, borderRadius: '24px', border: '1px solid #f0f0f0', bgcolor: '#fff' }}>
          
          <Typography variant="h3" sx={{ color: '#455a64', fontWeight: 700, mb: 1 }}>
            {primeiroNome} ,
          </Typography>

          <Typography variant="h6" sx={{ color: '#455a64', fontWeight: 500, mb: 4 }}>
            Sua compra no valor <span style={{ color: '#009fe3', fontWeight: 800 }}>
              {formatarMoeda(valorTotalSalvo)}
            </span> foi finalizada com sucesso
          </Typography>

          <Box 
            component="img" 
            src={seloSucesso} 
            sx={{ width: '100%', maxWidth: 220, mb: 5, mx: 'auto', display: 'block' }} 
          />

          <Button 
            fullWidth 
            variant="contained" 
            disableElevation
            onClick={() => {
                // LIMPEZA TOTAL E ATUALIZAÇÃO DO HEADER
                localStorage.removeItem('carrinhoSelecionado');
                localStorage.removeItem('valorTotal');
                window.dispatchEvent(new Event('cart-updated')); // Zera o contador do carrinho
                navigate('/');
            }}
            sx={{ 
              bgcolor: '#ff9800', 
              '&:hover': { bgcolor: '#f57c00' },
              fontWeight: 700, 
              py: 2, 
              fontSize: '1.1rem',
              borderRadius: '40px', 
              textTransform: 'none' 
            }}
          >
            INICIAR NOVA COMPRA
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5, bgcolor: 'transparent' }}>
      <form onSubmit={handleSubmit(aoEnviar)}>
        
        {/* DADOS DO CLIENTE */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#455a64', mb: 1 }}>Dados do Cliente</Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Field name="nome" component={renderTextField} label="Nome" placeholder="Nome do cliente aqui" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field name="email" component={renderTextField} label="Email" placeholder="Digite seu email aqui" />
            </Grid>
            <Grid item xs={12} md={3}>
              <Field name="sexo" component={renderSelectField} label="Sexo">
                <MenuItem value="" disabled>Selecione</MenuItem>
                <MenuItem value="masculino">Masculino</MenuItem>
                <MenuItem value="feminino">Feminino</MenuItem>
              </Field>
            </Grid>
          </Grid>
        </Box>

        {/* ENDEREÇO */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#455a64', mb: 1 }}>Endereço de Entrega</Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Field name="rua" component={renderTextField} label="Rua" placeholder="Av. Principal" />
            </Grid>
            <Grid item xs={12} md={2}>
              <Field name="numero" component={renderTextField} label="Número" placeholder="123" />
            </Grid>
            <Grid item xs={12} md={3}>
              <Field name="cidade" component={renderTextField} label="Cidade" placeholder="Sua Cidade" />
            </Grid>
            <Grid item xs={12} md={2}>
              <Field name="cep" component={renderTextField} label="CEP" placeholder="00000-000" />
            </Grid>
          </Grid>
        </Box>

        {/* PAGAMENTO */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#455a64', mb: 1 }}>Forma de Pagamento</Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container>
            <Grid item xs={12} md={6}>
              <Field name="pagamento" component={renderSelectField} label="Método de Pagamento">
                <MenuItem value="" disabled>Escolha como pagar</MenuItem>
                <MenuItem value="pix">Pix (5% de desconto)</MenuItem>
                <MenuItem value="cartao">Cartão de Crédito</MenuItem>
                <MenuItem value="boleto">Boleto Bancário</MenuItem>
              </Field>
            </Grid>
          </Grid>
        </Box>

        {/* FOOTER TOTAL */}
        <Box sx={{ p: 3, textAlign: 'right' }}>
          <Typography variant="body1" sx={{ color: '#78909c', mb: 0 }}>Total da Compra:</Typography>
          <Typography variant="h3" sx={{ color: '#009fe3', fontWeight: 600, mb: 4 }}>
            {formatarMoeda(valorTotalSalvo)}
          </Typography>
          
          <Button 
            type="submit" 
            variant="contained" 
            disabled={submitting}
            disableElevation 
            sx={{ 
              bgcolor: '#ff9800', 
              px: 10, py: 2, 
              fontSize: '1.1rem',
              fontWeight: 700, 
              borderRadius: '40px', 
              textTransform: 'none',
              '&:hover': { bgcolor: '#f57c00' } 
            }}
          >
            CONFIRMAR PEDIDO
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default reduxForm({ 
  form: 'checkoutForm',
  validate: values => {
    const errors = {};
    if (!values.nome) errors.nome = 'Campo obrigatório';
    if (!values.email) errors.email = 'Campo obrigatório';
    if (!values.sexo) errors.sexo = 'Campo obrigatório';
    if (!values.pagamento) errors.pagamento = 'Campo obrigatório';
    return errors;
  }
})(Finalizacao);