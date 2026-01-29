import React, { useState, useEffect } from 'react';
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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
      "& .MuiInputLabel-root": { fontSize: '1rem', fontWeight: 600 }
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
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd8dc" },
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
  const [carrinho, setCarrinho] = useState({});
  const [produtoAtivo, setProdutoAtivo] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');

  const produtosFiltrados = listaProdutos.filter((p) =>
    p.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const totalGeral = listaProdutos.reduce(
    (acc, p) => acc + p.preco * (carrinho[p.id] || 0),
    0
  );

  const alterarQtd = (id, delta) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  // Função para ajustar a quantidade DIRETAMENTE no carrinho
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

  const confirmarAdicao = (id) => {
    const qtdTemporaria = quantidades[id] || 0;
    if (qtdTemporaria > 0) {
      setCarrinho((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + qtdTemporaria
      }));
      setQuantidades((prev) => ({ ...prev, [id]: 0 }));
      setProdutoAtivo(null);
    } else {
      alert("Selecione uma quantidade primeiro!");
    }
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

  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!e.target.closest('[data-card-produto="true"]')) {
        setProdutoAtivo(null);
      }
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 15 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h5" fontWeight={600}>Produtos</Typography>
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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3
        }}
      >
        {produtosFiltrados.slice(0, 8).map((p) => {
          const selecionado = produtoAtivo === p.id;

          return (
            <Box
              key={p.id}
              data-card-produto="true"
              onClick={() => setProdutoAtivo(p.id)}
              sx={{
                p: 2,
                // ALTERAÇÃO AQUI:
                minHeight: 400,      // Garante que todos tenham pelo menos esse tamanho
                height: 'auto',      // Permite crescer se precisar (quando aparecer os botões)
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // Distribui o espaço verticalmente

                bgcolor: '#fff',
                borderRadius: '12px',
                border: selecionado ? '1px solid #e0e0e0' : '1px solid transparent',
                boxShadow: selecionado ? '0 8px 25px rgba(0,0,0,0.08)' : 'none',
                position: 'relative',
                transition: '0.3s',
                cursor: 'pointer',
                overflow: 'visible' // Se preferir, use 'hidden', mas com height auto não vai cortar
              }}
            >
              {/* Wrapper do Conteúdo Principal (Empurra o rodapé para baixo) */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <img
                    src={p.img}
                    alt={p.nome}
                    style={{ width: '100%', height: 160, objectFit: 'contain' }}
                  />
                </Box>

                <Typography sx={{ color: '#455a64', mb: 1, minHeight: 40 }}>
                  {p.nome}
                </Typography>

                <Typography variant="h6" fontWeight={800}>
                  {formatarMoeda(p.preco)}
                </Typography>

                <Typography variant="caption" display="block" sx={{ color: '#90a4ae' }}>
                  Em até 12x de {formatarMoeda(p.preco / 12)}
                </Typography>

                <Typography variant="caption" display="block" sx={{ color: '#b0bec5', fontWeight: 600 }}>
                  {formatarMoeda(p.preco * 0.9)} à vista (10% de desconto)
                </Typography>
              </Box>

              {/* ÁREA DOS BOTÕES (Footer) */}
              {/* Alterado: Removido position absolute. Adicionado mt: 2 para espaçamento */}
              {selecionado && (
                <Box
                  sx={{
                    mt: 2, // Margem superior para separar do texto
                    animation: 'fadeIn 0.3s ease-in', // Opcional: animação suave
                    '@keyframes fadeIn': {
                      '0%': { opacity: 0, transform: 'translateY(10px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' },
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      p: 0.5
                    }}
                  >
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
                    sx={{
                      bgcolor: '#009fe3',
                      fontWeight: 800,
                      borderRadius: '8px',
                      boxShadow: 'none'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmarAdicao(p.id);
                    }}
                  >
                    ADICIONAR
                  </Button>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {Object.keys(carrinho).some(id => carrinho[id] > 0) && (
        <Box sx={{ mt: 6, p: 3, bgcolor: '#f8f9fa', borderRadius: '12px', border: '1px solid #eceff1' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#455a64' }}>Itens no seu carrinho</Typography>
          {listaProdutos.filter(p => carrinho[p.id] > 0).map(item => (
            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img src={item.img} style={{ width: 50, height: 50, objectFit: 'contain' }} alt="" />
                <Box>
                  <Typography variant="body1" fontWeight={600}>{item.nome}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatarMoeda(item.preco)} cada
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {/* Controles de Quantidade no Carrinho */}
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', bgcolor: '#fff' }}>
                  <IconButton size="small" onClick={() => ajustarQtdNoCarrinho(item.id, -1)}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ px: 2, fontWeight: 700 }}>{carrinho[item.id]}</Typography>
                  <IconButton size="small" onClick={() => ajustarQtdNoCarrinho(item.id, 1)}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography variant="body1" fontWeight={700} sx={{ minWidth: 100, textAlign: 'right' }}>
                  {formatarMoeda(item.preco * carrinho[item.id])}
                </Typography>

                <IconButton color="error" size="small" onClick={() => ajustarQtdNoCarrinho(item.id, -carrinho[item.id])}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* DADOS DO CLIENTE */}
      <Box sx={{ mt: 8, mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#455a64' }}>Dados do Cliente</Typography>
        <Divider sx={{ mt: 1, mb: 4, borderColor: '#eceff1' }} />
      </Box>

      <form onSubmit={handleSubmit(aoEnviar)}>
        <Grid container spacing={3}>
          <Grid item xs={12}><Field name="nome" component={renderTextField} label="Nome" placeholder="Nome do cliente aqui" /></Grid>
          <Grid item xs={12} md={6}><Field name="email" component={renderTextField} label="Email" placeholder="Digite seu email aqui" /></Grid>
          <Grid item xs={12} md={6}>
            <Field name="sexo" component={renderSelectField} label="Sexo">
              <MenuItem value="" disabled>Selecione</MenuItem>
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="feminino">Feminino</MenuItem>
            </Field>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              mt: 5
            }}
          >
            <Box sx={{ textAlign: 'right' }}>
              <Typography
                sx={{
                  color: '#455a64',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  mb: 1
                }}
              >
                Total: <strong>{formatarMoeda(totalGeral)}</strong>
              </Typography>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#ff9800',
                  height: 50,
                  px: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': { bgcolor: '#f57c00' }
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

ProdutoForm = reduxForm({ form: 'produtoForm', validate })(ProdutoForm);
export default ProdutoForm;