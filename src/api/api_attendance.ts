import { apiInstance } from "./base.api";
import { Attendance, CreateAttendance, UpdateAttendance, AttendanceAnalytics } from "../interfaces/attendance_interface";

const API_URL = "/attendances";

export const getAllAttendances = async (): Promise<Attendance[]> => {
    try {
        const response = await apiInstance.get<Attendance[]>(`${API_URL}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching attendances: ", error);
        throw new Error("Failed to fetch all attendances");
    }
};

export const getAttendanceById = async (attendance_id: string): Promise<Attendance> => {
    try {
        const response = await apiInstance.get<Attendance>(`${API_URL}/${attendance_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching attendance: ", error);
        throw new Error("Failed to fetch attendance by ID");
    }
};

export const getAttendancesByStudent = async (
    student_id: string,
    start_date?: string,
    end_date?: string
): Promise<Attendance[]> => {
    try {
        const params = new URLSearchParams();
        if (start_date) params.append("start_date", start_date);
        if (end_date) params.append("end_date", end_date);
        
        const response = await apiInstance.get<Attendance[]>(
            `${API_URL}/student/${student_id}?${params.toString()}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching attendances by student: ", error);
        throw new Error("Failed to fetch attendances by student");
    }
};

export const getAttendancesBySubject = async (
    subject_id: string,
    date?: string
): Promise<Attendance[]> => {
    try {
        const params = date ? `?date=${date}` : '';
        const response = await apiInstance.get<Attendance[]>(
            `${API_URL}/subject/${subject_id}${params}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching attendances by subject: ", error);
        throw new Error("Failed to fetch attendances by subject");
    }
};

export const getAttendanceAnalytics = async (
    student_id: string,
    subject_id?: string
): Promise<AttendanceAnalytics> => {
    try {
        const params = subject_id ? `?subject_id=${subject_id}` : '';
        const response = await apiInstance.get<AttendanceAnalytics>(
            `${API_URL}/analytics/student/${student_id}${params}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching attendance analytics: ", error);
        throw new Error("Failed to fetch attendance analytics");
    }
};

export const createAttendance = async (attendance: CreateAttendance): Promise<Attendance> => {
    try {
        const response = await apiInstance.post<Attendance>(API_URL, attendance);
        return response.data;
    } catch (error) {
        console.error("Error creating attendance: ", error);
        throw new Error("Failed to create attendance");
    }
};

export const updateAttendance = async (
    attendanceId: string,
    attendanceData: UpdateAttendance
): Promise<Attendance> => {
    try {
        const response = await apiInstance.put<Attendance>(
            `${API_URL}/${attendanceId}`,
            attendanceData
        );
        return response.data;
    } catch (error) {
        console.error("Error updating attendance: ", error);
        throw new Error("Failed to update attendance");
    }
};

export const deleteAttendance = async (attendanceId: string): Promise<void> => {
    try {
        await apiInstance.delete(`${API_URL}/${attendanceId}`);
    } catch (error) {
        console.error("Error deleting attendance: ", error);
        throw new Error("Failed to delete attendance");
    }
};