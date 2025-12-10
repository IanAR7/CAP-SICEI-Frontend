import { apiInstance } from "./base.api";
import { 
    Attendance, 
    CreateAttendance, 
    UpdateAttendance, 
    AttendanceAnalytics,
    AttendanceSession,
    SessionStudentAttendance,
    CreateBulkAttendance 
} from "../interfaces/attendance_interface";

const API_URL = "/attendances";

// ============ FUNCIONES PARA SESIONES AGRUPADAS ============

export const getAttendanceSessions = async (): Promise<AttendanceSession[]> => {
    try {
        const response = await apiInstance.get<Attendance[]>(`${API_URL}`);
        const attendances = response.data;

        // Agrupar por subject_id y fecha
        const sessionMap = new Map<string, AttendanceSession>();

        attendances.forEach(att => {
            const dateOnly = att.date.split('T')[0];
            const key = `${att.subject_id}-${dateOnly}`;

            if (!sessionMap.has(key)) {
                sessionMap.set(key, {
                    subject_id: att.subject_id,
                    subject_name: "",
                    date: dateOnly,
                    total_students: 0,
                    present_count: 0,
                    absent_count: 0,
                    late_count: 0,
                    excused_count: 0,
                });
            }

            const session = sessionMap.get(key)!;
            session.total_students++;

            switch (att.status) {
                case "present": session.present_count++; break;
                case "absent": session.absent_count++; break;
                case "late": session.late_count++; break;
                case "excused": session.excused_count++; break;
            }
        });

        return Array.from(sessionMap.values());
    } catch (error) {
        console.error("Error fetching attendance sessions: ", error);
        throw new Error("Failed to fetch attendance sessions");
    }
};

export const getSessionDetails = async (
    subject_id: string,
    date: string
): Promise<SessionStudentAttendance[]> => {
    try {
        const response = await apiInstance.get<Attendance[]>(
            `${API_URL}/subject/${subject_id}?date=${date}`
        );

        return response.data.map(att => ({
            attendance_id: att.id,
            student_id: att.student_id,
            student_name: "",
            status: att.status,
            notes: att.notes,
        }));
    } catch (error) {
        console.error("Error fetching session details: ", error);
        throw new Error("Failed to fetch session details");
    }
};

export const createBulkAttendance = async (
    bulkData: CreateBulkAttendance
): Promise<Attendance[]> => {
    try {
        const promises = bulkData.students.map(student =>
            apiInstance.post<Attendance>(API_URL, {
                student_id: student.student_id,
                subject_id: bulkData.subject_id,
                date: bulkData.date,
                status: student.status,
                notes: student.notes,
            })
        );

        const responses = await Promise.all(promises);
        return responses.map(res => res.data);
    } catch (error) {
        console.error("Error creating bulk attendance: ", error);
        throw new Error("Failed to create bulk attendance");
    }
};

export const checkSessionExists = async (
    subject_id: string,
    date: string
): Promise<boolean> => {
    try {
        const response = await apiInstance.get<Attendance[]>(
            `${API_URL}/subject/${subject_id}?date=${date}`
        );
        return response.data.length > 0;
    } catch (error) {
        console.error("Error checking session existence: ", error);
        return false;
    }
};

// ============ FUNCIONES ORIGINALES (COMPATIBILIDAD) ============

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