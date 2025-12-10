import { 
  Box, 
  TextField, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert
} from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm, Controller } from "react-hook-form";
import { useCustom } from "@refinedev/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Subject } from "../../interfaces/subject_interface";
import { Student } from "../../interfaces/student_interface";
import { checkSessionExists, createBulkAttendance } from "../../api/api_attendance";

type StudentRow = {
  student_id: string;
  student_name: string;
  status: "present" | "absent" | "late" | "excused";
  notes: string;
};

type FormValues = {
  subject_id: string;
  date: string;
};

export const AttendanceCreate = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
  const [studentRows, setStudentRows] = React.useState<StudentRow[]>([]);
  const [sessionExists, setSessionExists] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const navigate = useNavigate();

  const { data: subjectsData } = useCustom<Subject[]>({
    url: "subjects",
    method: "get",
  });

  const { data: studentsData } = useCustom<Student[]>({
    url: "students",
    method: "get",
  });

  const subjects = subjectsData?.data || [];
  const students = studentsData?.data || [];

  const selectedSubject = watch("subject_id");
  const selectedDate = watch("date");

  React.useEffect(() => {
    if (selectedSubject && selectedDate) {
      setIsChecking(true);
      checkSessionExists(selectedSubject, selectedDate)
        .then(setSessionExists)
        .finally(() => setIsChecking(false));
    }
  }, [selectedSubject, selectedDate]);

  React.useEffect(() => {
    if (selectedSubject && students.length > 0) {
      const rows: StudentRow[] = students.map((s) => ({
        student_id: s.id,
        student_name: `${s.name} ${s.lastname}`,
        status: "present",
        notes: "",
      }));
      setStudentRows(rows);
    }
  }, [selectedSubject, students]);

  const handleStatusChange = (studentId: string, newStatus: "present" | "absent" | "late" | "excused") => {
    setStudentRows((prev) =>
      prev.map((row) =>
        row.student_id === studentId ? { ...row, status: newStatus } : row
      )
    );
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setStudentRows((prev) =>
      prev.map((row) =>
        row.student_id === studentId ? { ...row, notes } : row
      )
    );
  };

  const onSubmit = async (data: FormValues) => {
    if (sessionExists) return;

    setIsCreating(true);
    try {
      await createBulkAttendance({
        subject_id: data.subject_id,
        date: data.date,
        students: studentRows.map((row) => ({
          student_id: row.student_id,
          status: row.status,
          notes: row.notes || undefined,
        })),
      });
      navigate("/attendances");
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const statusColors = {
    present: "success",
    absent: "error",
    late: "warning",
    excused: "info",
  } as const;

  return (
    <Create
      isLoading={isCreating}
      saveButtonProps={{
        onClick: handleSubmit(onSubmit),
        disabled: sessionExists || isChecking || !selectedSubject || !selectedDate,
      }}
    >
      <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Campos de configuración */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <FormControl fullWidth error={!!errors.subject_id}>
            <InputLabel id="subject-label">Subject</InputLabel>
            <Controller
              name="subject_id"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select {...field} labelId="subject-label" label="Subject">
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.name} (ID: {subject.id})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.subject_id && (
              <FormHelperText>{errors.subject_id.message}</FormHelperText>
            )}
          </FormControl>

          <Controller
            name="date"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.date}
                helperText={errors.date?.message}
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Box>

        {/* Alerta de sesión duplicada */}
        {sessionExists && (
          <Alert severity="error">
            Ya existe una sesión de asistencia para esta materia en esta fecha.
          </Alert>
        )}

        {/* Tabla estilo Excel */}
        {selectedSubject && selectedDate && !sessionExists && studentRows.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Student ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentRows.map((row) => (
                  <TableRow key={row.student_id} hover>
                    <TableCell>{row.student_id}</TableCell>
                    <TableCell>{row.student_name}</TableCell>
                    <TableCell align="center">
                      <Select
                        size="small"
                        value={row.status}
                        onChange={(e) =>
                          handleStatusChange(
                            row.student_id,
                            e.target.value as "present" | "absent" | "late" | "excused"
                          )
                        }
                        renderValue={(value) => (
                          <Chip
                            label={value.toUpperCase()}
                            color={statusColors[value]}
                            size="small"
                          />
                        )}
                      >
                        <MenuItem value="present">Present</MenuItem>
                        <MenuItem value="absent">Absent</MenuItem>
                        <MenuItem value="late">Late</MenuItem>
                        <MenuItem value="excused">Excused</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Optional notes"
                        value={row.notes}
                        onChange={(e) =>
                          handleNotesChange(row.student_id, e.target.value)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Create>
  );
};