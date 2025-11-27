import { Box, TextField, MenuItem, Select, InputLabel, FormControl, FormHelperText } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm, Controller } from "@refinedev/react-hook-form";
import { useParams } from "react-router-dom";
import { UpdateAttendance } from "../../interfaces/attendance_interface";

type FormValues = UpdateAttendance;

export const AttendanceEdit = () => {
  const { id } = useParams<{ id: string }>();

  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    refineCoreProps: {
      action: "edit",
      id: id,
      resource: "attendances",
    },
  });

  return (
    <Edit isLoading={false} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("date")}
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
          label="Notes"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </Box>
    </Edit>
  );
};