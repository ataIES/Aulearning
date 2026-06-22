export function handleApiError(error, showError, setFormErrors) {

    const response = error.response?.data;

    if (response?.errors) {

        setFormErrors?.(response.errors);

        const first = Object.values(response.errors)[0]?.[0];

        showError(first ?? response.message);

        return;
    }

    showError(response?.message ?? 'Ha ocurrido un error inesperado.');
}