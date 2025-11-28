import { Student } from "./student_interface";

export interface RiskStudent extends Student {
    isAtRisk: boolean;
}
