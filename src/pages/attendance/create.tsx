import { Box, TextField, MenuItem, Select, InputLabel, FormControl, FormHelperText } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm, Controller } from "@refinedev/react-hook-form";
import { useCustom } from "@refinedev/core";
import { Student } from "../../interfaces/student_interface";
import { Subject } from "../../interfaces/subject_interface";
import { CreateAttendance } from "../../interfaces/attendance_interface";

type FormValues = CreateAttendance;

export const AttendanceCreate = () => {
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
    refineCore: { formLoading },
  } = useForm<FormValues>({
    refineCoreProps: {
      resource: "attendances",
      action: "create",
    },
  });

  const { data: studentsData } = useCustom<Student[]>({
    url: "students",
    method: "get",
  });

  const { data: subjectsData } = useCustom<Subject[]>({
    url: "subjects",
    method: "get",
  });

  const students = studentsData?.data || [];
  const subjects = subjectsData?.data || [];

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <FormControl fullWidth margin="normal" error={!!errors.student_id}>
          <InputLabel id="student-label">Student</InputLabel>
          <Controller
            name="student_id"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Select
                {...field}
                labelId="student-label"
                label="Student"
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name} {student.lastname}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.student_id && (
            <FormHelperText>{errors.student_id.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.subject_id}>
          <InputLabel id="subject-label">Subject</InputLabel>
          <Controller
            name="subject_id"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Select
                {...field}
                labelId="subject-label"
                label="Subject"
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.subject_id && (
            <FormHelperText>{errors.subject_id.message}</FormHelperText>
          )}
        </FormControl>

        <TextField
          {...register("date", { required: "This field is required" })}
          error={!!errors.date}
          helperText={typeof errors.date?.message === "string" ? errors.date.message : ""}
          margin="normal"
          fullWidth
          type="datetime-local"
          label="Date and Time"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        <FormControl fullWidth margin="normal" error={!!errors.status}>
          <InputLabel id="status-label">Status</InputLabel>
          <Controller
            name="status"
            control={control}
            rules={{ required: "This field is required" }}
            defaultValue="present"
            render={({ field }) => (
              <Select
                {...field}
                labelId="status-label"
                label="Status"
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="late">Late</MenuItem>
                <MenuItem value="excused">Excused</MenuItem>
              </Select>
            )}
          />
          {errors.status && (
            <FormHelperText>{errors.status.message}</FormHelperText>
          )}
        </FormControl>

        <TextField
          {...register("notes")}
          margin="normal"
          fullWidth
          multiline
          rows={3}
          label="Notes (Optional)"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </Box>
    </Create>
  );
};