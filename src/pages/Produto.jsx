import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { validate } from '../utils/validate';

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    label={label}
    error={touched && !!error}
    helperText={touched && error}
    fullWidth
    variant="outlined"
    {...input}
    {...custom}
  />
);

let ProdutoForm = (props) => {

    const { handleSubmit } = props;
    const navigate = useNavigate();
    const aoEnviar = (values) => {
    const precoUnitario = 50;
    const total = values.quantidade * precoUnitario;

    localStorage.setItem('clienteNome', values.nome);
    localStorage.setItem('valorTotal', total);

    navigate('/checkout');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Detalhes do Produto
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(aoEnviar)} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Field name="nome" component={renderTextField} label="Seu Nome Completo" />
          </Grid>
          <Grid item xs={12}>
            <Field name="email" component={renderTextField} label="E-mail" />
          </Grid>
          <Grid item xs={12}>
            <Field 
              name="quantidade" 
              component={renderTextField} 
              label="Quantidade" 
              type="number" 
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              color="primary" 
              size="large"
            >
              Finalizar Compra
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};


ProdutoForm = reduxForm({
  form: 'produto', 
  validate,
})(ProdutoForm);

export default ProdutoForm;