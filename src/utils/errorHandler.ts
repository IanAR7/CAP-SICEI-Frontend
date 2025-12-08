import axios from 'axios';

export const errorHandler = (error: unknown, action: string) => {
    if (axios.isAxiosError(error)) {
        console.warn(`⚠️ API no disponible durante ${action}. Backend no está corriendo.`);
        // No lanzar error, solo retornar null para evitar crash
        return null;
    } else {
        console.warn(`⚠️ Error durante ${action}: `, error);
        return null;
    }
}