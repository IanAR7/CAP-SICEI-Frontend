import { Create } from "@refinedev/mui";
import {
  Box,
  TextField,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  FormHelperText
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { getAllStudents } from "../../api/api_students";
import { Student } from "../../interfaces/student_interface";

export const AlertCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "alerts",
      action: "create",
    },
  });

  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    getAllStudents()
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error cargando estudiantes:", err));
  }, []);

  const alertTypes = [
    { value: "risk_of_failure", label: "Risk of Failure" },
    { value: "attendance", label: "Attendance" },
    { value: "school_event", label: "School Event" },
    { value: "holiday", label: "Holiday" },
    { value: "grades_published", label: "Grades Published" },
    { value: "general", label: "General" },
  ];

  const channels = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "both", label: "Both" },
  ];

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        {/* Title */}
        <TextField
          {...register("title", { required: "This field is required" })}
          error={!!errors.title}
          helperText={errors.title?.message === "string" ? errors.title.message : ""}
          label="Title"
          fullWidth
        />

        {/* Message */}
        <TextField
          {...register("message", { required: "This field is required" })}
          error={!!errors.message}
          helperText={errors.message?.message === "string" ? errors.message.message : ""}
          label="Message"
          fullWidth
          multiline
          rows={4}
        />

        {/* Alert Type */}
        <Controller
          control={control}
          name="alert_type"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              error={!!errors.alert_type}
              helperText={errors.alert_type?.message === "string" ? errors.alert_type.message : ""}
              label="Alert Type"
              fullWidth
            >
              {alertTypes.map((opt) => (
                <MenuItem value={opt.value} key={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Channel */}
        <Controller
          control={control}
          name="channel"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              error={!!errors.channel}
              helperText={errors.channel?.message === "string" ? errors.channel.message : ""}
              label="Notification Channel"
              fullWidth
            >
              {channels.map((opt) => (
                <MenuItem value={opt.value} key={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Recipients */}
        <Controller
          control={control}
          name="target_recipients"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.target_recipients}>
              <InputLabel id="recipients-label">Recipients</InputLabel>
              <Select
                {...field}
                labelId="recipients-label"
                label="Recipients"
                multiple
                input={<OutlinedInput label="Recipients" />}
                value={field.value || []}
                onChange={(e) => field.onChange(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {selected.map((email: string) => (
                      <Chip key={email} label={email} size="small" />
                    ))}
                  </Box>
                )}
              >
                {students.map((s) => (
                  <MenuItem key={s.id} value={s.email}>
                    {s.name} {s.lastname} — {s.email}
                  </MenuItem>
                ))}
              </Select>
              {errors.target_recipients && (
                <FormHelperText>
                  {errors.target_recipients.message as string}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        {/* Scheduled date */}
        <TextField
          {...register("scheduled_at")}
          type="datetime-local"
          label="Schedule For (Optional)"
          fullWidth
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        <input type="hidden" {...register("created_by")} value="admin001" />
      </Box>
    </Create>
  );
};

