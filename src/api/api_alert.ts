import { apiInstance } from "./base.api";
import { Alert } from "../interfaces/alert_interface";

const API_URL = "/alerts";

export const getAllAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await apiInstance.get<Alert[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching alerts: ", error);
    throw new Error("Failed to fetch alerts");
  }
};

export const createAlert = async (
  alertData: Omit<Alert, "id" | "status" | "created_at" | "sent_at">
): Promise<Alert> => {
  try {
    const response = await apiInstance.post<Alert>(API_URL, alertData);
    return response.data;
  } catch (error) {
    console.error("Error creating alert: ", error);
    throw new Error("Failed to create alert");
  }
};

export const sendAlert = async (alertId: number): Promise<Alert> => {
  try {
    const response = await apiInstance.post<Alert>(`${API_URL}/${alertId}/send`);
    return response.data;
  } catch (error) {
    console.error("Error sending alert: ", error);
    throw new Error("Failed to send alert");
  }
};
