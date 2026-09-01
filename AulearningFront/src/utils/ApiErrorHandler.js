export function handleApiError(
  error,
  showError,
  setFormErrors
) {
  const response = error?.response?.data;

  if (response?.errors) {
    setFormErrors?.(
      response.errors
    );

    const first = Object
      .values(response.errors)
      .flat()
      .find(Boolean);

    showError(
      first ??
        response.message ??
        'Los datos introducidos no son válidos.',
      'Error de validación'
    );

    return;
  }

  if (!error?.response) {
    showError(
      error?.message ??
        'No se ha podido conectar con el servidor.',
      'Error'
    );

    return;
  }

  showError(
    response?.message ??
      'Ha ocurrido un error inesperado.',
    'Error'
  );
}