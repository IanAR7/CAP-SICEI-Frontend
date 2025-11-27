import { Stack, Typography, Chip } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { Attendance } from "../../interfaces/attendance_interface";

export const AttendanceShow = () => {
  const { query } = useShow<Attendance>();

  const { data, isLoading } = query;
  const record = data?.data;

  const statusColors = {
    present: "success",
    absent: "error",
    late: "warning",
    excused: "info",
  } as const;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {"ID"}
        </Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          {"Student ID"}
        </Typography>
        <TextField value={record?.student_id} />

        <Typography variant="body1" fontWeight="bold">
          {"Subject ID"}
        </Typography>
        <TextField value={record?.subject_id} />

        <Typography variant="body1" fontWeight="bold">
          {"Date"}
        </Typography>
        <TextField value={record?.date ? new Date(record.date).toLocaleString() : ""} />

        <Typography variant="body1" fontWeight="bold">
          {"Status"}
        </Typography>
        {record?.status && (
          <Chip
            label={record.status.toUpperCase()}
            color={statusColors[record.status as keyof typeof statusColors]}
          />
        )}

        <Typography variant="body1" fontWeight="bold">
          {"Notes"}
        </Typography>
        <TextField value={record?.notes || "No notes"} />

        <Typography variant="body1" fontWeight="bold">
          {"Created At"}
        </Typography>
        <TextField value={record?.created_at ? new Date(record.created_at).toLocaleString() : ""} />

        <Typography variant="body1" fontWeight="bold">
          {"Updated At"}
        </Typography>
        <TextField value={record?.updated_at ? new Date(record.updated_at).toLocaleString() : ""} />
      </Stack>
    </Show>
  );
};