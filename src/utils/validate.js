export const validate = values => {
  const errors = {};
  if (!values.nome) {
    errors.nome = 'O nome é obrigatório';
  } else if (values.nome.length < 3) {
    errors.nome = 'Nome deve ter pelo menos 3 caracteres';
  }

  if (!values.email) {
    errors.email = 'E-mail é obrigatório';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'E-mail inválido';
  }

  if (!values.quantidade || values.quantidade < 1) {
    errors.quantidade = 'A quantidade deve ser pelo menos 1';
  }

  return errors;
};