import { Edit } from "@refinedev/mui";
import { Box, TextField, MenuItem } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";

export const AlertEdit = () => {
  const { id } = useParams<{ id: string }>();

  const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      action: "edit",
      id,
      resource: "alerts",
    },
  });

  const alertsData = queryResult?.data?.data;

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

  const formatForDateTimeLocal = (isoDate: string) => {
    if (!isoDate) return "";

    try {
      const date = new Date(isoDate);

      if (isNaN(date.getTime())) return "";

      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        <TextField
          {...register("title", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.title}
          helperText={(errors as any)?.title?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Title"
          name="title"
          defaultValue={alertsData?.title || ""}
        />

        <TextField
          {...register("message", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.message}
          helperText={(errors as any)?.message?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          multiline
          rows={4}
          label="Message"
          name="message"
          defaultValue={alertsData?.message || ""}
        />

        <Controller
          control={control}
          name="alert_type"
          rules={{ required: "This field is required" }}
          defaultValue={alertsData?.alert_type || ""}
          render={({ field }) => (
            <TextField
              {...field}
              select
              error={!!(errors as any)?.alert_type}
              helperText={(errors as any)?.alert_type?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Alert Type"
              value={field.value || ""}
            >
              {alertTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          control={control}
          name="channel"
          rules={{ required: "This field is required" }}
          defaultValue={alertsData?.channel || ""}
          render={({ field }) => (
            <TextField
              {...field}
              select
              error={!!(errors as any)?.channel}
              helperText={(errors as any)?.channel?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Notification Channel"
              value={field.value || ""}
            >
              {channels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          control={control}
          name="scheduled_at"
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="datetime-local"
              label="Schedule For (Optional)"
              name="scheduled_at"
              value={formatForDateTimeLocal(field.value) || ""}
              onChange={(e) => {
                if (e.target.value) {
                  const isoDate = new Date(e.target.value + ":00Z").toISOString();
                  field.onChange(isoDate);
                } else {
                  field.onChange(null);
                }
              }}
              inputProps={{
              }}
            />
          )}
        />
      </Box>
    </Edit>
  );
};