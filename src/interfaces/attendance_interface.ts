export interface Attendance {
    id: string;
    student_id: string;
    subject_id: string;
    professor_id?: string;
    date: string; // ISO string from backend
    status: "present" | "absent" | "late" | "excused";
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface AttendanceWithDetails {
    id: string;
    student_name: string;
    subject_name: string;
    professor_name?: string;
    date: string;
    status: "present" | "absent" | "late" | "excused";
    notes?: string;
}

export interface AttendanceAnalytics {
    total_classes: number;
    attended: number;
    absent: number;
    late: number;
    excused: number;
    attendance_percentage: number;
    consecutive_absences: number;
}

export type CreateAttendance = Omit<Attendance, "id" | "created_at" | "updated_at">;
export type UpdateAttendance = Partial<Pick<Attendance, "status" | "notes" | "date">>;