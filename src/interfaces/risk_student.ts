import { Student } from "./student_interface";

export interface StudentRiskReport extends Student {
  risk_status: string;
  probability: number;
}

export interface RiskStudent extends Student {
  risk_status?: string;
  probability?: number;
  isAtRisk?: boolean;
}

export interface BatchUploadResponse {
  processed: StudentRiskReport[];
  not_found: Student[]; 
}
