export interface Subject {
    id: string;
    name: string;
    description?: string;
    credits: number;
    semester: number;
    professor_id?: string | null;

}