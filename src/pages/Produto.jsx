import React, { useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import { validate } from '../utils/validate';

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
  { id: 2, nome: 'Cabo de Lightning para USB-C (1 m)', preco: 199, img: produto02 },
  { id: 3, nome: 'Carregador USB-C de 20W da Apple', preco: 199, img: produto03 },
  { id: 4, nome: 'Adaptador de Energia USB da Apple (5W)', preco: 99, img: produto04 },
  { id: 5, nome: 'Cabo de Lightning para USB (1 m)', preco: 149, img: produto05 },
  { id: 6, nome: 'Adaptador de Lightning para 3,5 mm da Apple', preco: 149, img: produto06 },
  { id: 7, nome: 'Suporte para iPhone MagSafe da Apple', preco: 399, img: produto07 },
  { id: 8, nome: 'Capa MagSafe para iPhone 13 Pro', preco: 599, img: produto08 }
];

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);

/* ---------- FIELDS ---------- */

const renderTextField = ({ input, label, placeholder, meta: { touched, error }, ...rest }) => (
  <TextField
    {...input}
    {...rest}
    label={label}
    placeholder={placeholder}
    variant="outlined"
    error={touched && !!error}
    helperText={touched && error}
    fullWidth
    InputLabelProps={{ shrink: true }}
    sx={{
      "& .MuiOutlinedInput-root": {
        width: 400,
        maxWidth: 400,
        height: 70, 
        fontSize: '1.1rem', 
        "& fieldset": { borderColor: "#cfd8dc" },
      },
      "& .MuiInputLabel-root": { fontSize: '1rem', fontWeight: 600, width: 400, maxWidth: 400 }
    }}
  />
);

const renderSelectField = ({ input, label, meta: { touched, error }, children }) => (
  <FormControl fullWidth variant="outlined" error={touched && !!error}>
    <InputLabel shrink sx={{ fontSize: '1rem', fontWeight: 600 }}>{label}</InputLabel>
    <Select
      {...input}
      label={label}
      displayEmpty
      notched
      sx={{
        width: 280,
        maxWidth: 280,
        height: 70, 
        fontSize: '1.1rem',
        color: !input.value ? "#b0bec5" : "inherit",
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd8dc", width: 280, maxWidth: 280 },
      }}
    >
      {children}
    </Select>
    {touched && error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

/* ---------- COMPONENT ---------- */

let ProdutoForm = ({ handleSubmit }) => {
  const navigate = useNavigate();

  const [quantidades, setQuantidades] = useState({});
  const [produtoAtivo, setProdutoAtivo] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');

  const produtosFiltrados = listaProdutos.filter((p) =>
    p.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const totalGeral = listaProdutos.reduce(
    (acc, p) => acc + p.preco * (quantidades[p.id] || 0),
    0
  );

  const alterarQtd = (id, delta) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const adicionarProduto = () => {
    setProdutoAtivo(null);
  };

  const aoEnviar = (values) => {
    if (totalGeral === 0) {
      alert('Selecione pelo menos um produto!');
      return;
    }

    localStorage.setItem('clienteNome', values.nome);
    localStorage.setItem('valorTotal', totalGeral);
    navigate('/checkout');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 15 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h5" fontWeight={600}>
          Produtos
        </Typography>

        <TextField
          size="small"
          placeholder="Pesquisar acessório Apple..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          sx={{ width: 280 }}
        />
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* PRODUTOS */}
      <Grid container spacing={4} justifyContent="center">
        {produtosFiltrados.map((p) => {
          const ativo = produtoAtivo === p.id;

          return (
            <Grid item xs={12} sm={6} md={3} key={p.id}>
              <Box
                onClick={() => setProdutoAtivo(p.id)}
                sx={{
                  textAlign: 'center',
                  p: ativo ? 3 : 1,
                  borderRadius: 2,
                  bgcolor: ativo ? '#fff' : 'transparent',
                  boxShadow: ativo
                    ? '0 6px 20px rgba(0,0,0,0.12)'
                    : 'none',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
              >
                <img
                  src={p.img}
                  alt={p.nome}
                  style={{
                    width: '100%',
                    maxWidth: ativo ? 180 : 140,
                    height: 160,
                    objectFit: 'contain',
                    marginBottom: 15
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ color: '#607d8b', mb: 1, minHeight: 40 }}
                >
                  {p.nome}
                </Typography>

                <Typography variant="h6" fontWeight="bold">
                  {formatarMoeda(p.preco)}
                </Typography>

                {ativo && (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 2
                      }}
                    >
                      <IconButton onClick={() => alterarQtd(p.id, -1)}>
                        <RemoveIcon />
                      </IconButton>

                      <Box sx={{ mx: 2, fontWeight: 'bold' }}>
                        {quantidades[p.id] || 0}
                      </Box>

                      <IconButton onClick={() => alterarQtd(p.id, 1)}>
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 2,
                        bgcolor: '#039be5',
                        '&:hover': { bgcolor: '#0288d1' }
                      }}
                      onClick={adicionarProduto}
                    >
                      ADICIONAR
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* TÍTULO COM LINHA MAIS LONGA */}
      <Box sx={{ mt: 6, mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#455a64' }}>
          Dados do Cliente
        </Typography>
        <Divider sx={{ mt: 1, mb: 4, borderColor: '#eceff1' }} />
      </Box>

      <form onSubmit={handleSubmit(aoEnviar)}>
        <Grid container spacing={2}>

          {/* Campo Nome: md={5} - Ocupa quase metade da linha */}
          <Grid item xs={12} md={100}>
            <Field
              name="nome"
              component={renderTextField}
              label="Nome"
              placeholder="Nome do cliente aqui"
            />
          </Grid>

          {/* Campo Email: md={4.5} */}
          <Grid item xs={12} md={5.5}>
            <Field
              name="email"
              component={renderTextField}
              label="Email"
              placeholder="Digite seu email aqui"
            />
          </Grid>

          {/* Campo Sexo: md={2.5} - Fecha a linha com o seletor maior */}
          <Grid item xs={12} md={5.5}>
            <Field name="sexo" component={renderSelectField} label="Sexo">
              <MenuItem value="" disabled>Selecione</MenuItem>
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="feminino">Feminino</MenuItem>
            </Field>
          </Grid>

          {/* BLOCO DO TOTAL E BOTÃO */}
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 8,
              ml: 'auto',
              marginBottom: -8,
            }}
          >
            <Box sx={{ width: 220 }}>
              <Typography
                sx={{
                  color: '#455a64',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  mb: 2,
                  textAlign: 'center',
                  letterSpacing: '-0.01em'
                }}
              >
                Total: <strong>{formatarMoeda(totalGeral)}</strong>
              </Typography>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#ff9800',
                  height: 45,
                  marginLeft: -2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  boxShadow: 'none',
                  textTransform: 'uppercase',
                  '&:hover': {
                    bgcolor: '#f57c00',
                    boxShadow: 'none'
                  }
                }}
              >
                Finalizar compra
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

ProdutoForm = reduxForm({
  form: 'produtoForm',
  validate
})(ProdutoForm);

export default ProdutoForm;
