// src/api/api_predictions.ts

import { apiInstance } from "./base.api";
import { BatchUploadResponse } from "../interfaces/risk_student";

const API_URL = "/predictions";

export const uploadBatchPrediction = async (file: File): Promise<BatchUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiInstance.post<BatchUploadResponse>(
    `${API_URL}/batch-upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  // opcional: verificar o mapear datos
  const data = response.data;

  data.processed = data.processed.map((r) => ({
    id: r.id,
    name: r.name,
    lastname: r.lastname,
    email: r.email,
    semester: r.semester,
    risk_status: r.risk_status ?? "Desconocido", 
    probability: r.probability,
  }));

  return data;
};
