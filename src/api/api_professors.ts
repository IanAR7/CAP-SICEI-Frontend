import { apiInstance } from "./base.api";
import { Professor } from "../interfaces/professor_interface";

const API_URL = "/professors";

// GET ALL
export const getAllProfessors = async (): Promise<Professor[]> => {
    try {
        const response = await apiInstance.get<Professor[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching professors: ", error);
        throw new Error("Failed to fetch all professors");
    }
};

// GET BY ID
export const getProfessorById = async (professor_id: string): Promise<Professor> => {
    try {
        const response = await apiInstance.get<Professor>(`${API_URL}/${professor_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching professor: ", error);
        throw new Error("Failed to fetch professor by ID");
    }
};

// CREATE
export const createProfessor = async (professor: Omit<Professor, "id">): Promise<Professor> => {
    try {
        const response = await apiInstance.post<Professor>(API_URL, professor);
        return response.data;
    } catch (error) {
        console.error("Error creating professor: ", error);
        throw new Error("Failed to create professor");
    }
};

// UPDATE
export const updateProfessor = async (
    professorId: string,
    professorData: Partial<Professor>
): Promise<Professor> => {
    try {
        const response = await apiInstance.put<Professor>(`${API_URL}/${professorId}`, professorData);
        return response.data;
    } catch (error) {
        console.error("Error updating professor: ", error);
        throw new Error("Failed to update professor");
    }
};

// DELETE
export const deleteProfessor = async (professorId: string): Promise<void> => {
    try {
        await apiInstance.delete(`${API_URL}/${professorId}`);
    } catch (error) {
        console.error("Error deleting professor: ", error);
        throw new Error("Failed to delete professor");
    }
};
