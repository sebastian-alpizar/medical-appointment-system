const API_URL = process.env.REACT_APP_API_URL;

export async function FetchRequest(url, options = {}, includeAuth = true) {
    const token = localStorage.getItem('token');
    const isFormData = options.body instanceof FormData;

    const headers = {
        // No establezcas Content-Type por defecto para FormData
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...(includeAuth && token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    const finalOptions = {
        method: options.method || 'GET',
        headers,
        ...options
    };

    try {
        const response = await fetch(API_URL + url, finalOptions);

        if (!response.ok) {
            let errorText = '';
            try {
                errorText = await response.text();
            } catch {
                errorText = 'No se pudo obtener el mensaje de error';
            }

            let message = '';
            try {
                const json = JSON.parse(errorText);
                message = json.message || JSON.stringify(json);
            } catch {
                message = errorText || `Error HTTP ${response.status}`;
            }

            // Mensajes personalizados según código HTTP
            switch (response.status) {
                case 401:
                    alert("No autorizado.");
                    break;
                case 403:
                    alert("Acceso denegado. No tienes permiso para realizar esta acción.");
                    break;
                case 500:
                    alert("Error del servidor. Intenta más tarde.");
                    break;
                default:
                    alert(`Error: ${message}`);
            }

            return null;
        }

        const contentType = response.headers.get('Content-Type');
        return contentType && contentType.includes('application/json')
            ? await response.json()
            : await response.text();

    } catch (error) {
        alert("Error de red: no se pudo contactar con el servidor.");
        console.error("Network error:", error);
        return null;
    }
}
