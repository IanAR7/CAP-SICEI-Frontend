import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { Professor } from "../../interfaces/professor_interface";

export const ProfessorShow = () => {
  const { query } = useShow<Professor>();

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">{"ID"}</Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">{"Full Name"}</Typography>
        <TextField value={`${record?.first_name} ${record?.last_name}`} />

        <Typography variant="body1" fontWeight="bold">{"Email"}</Typography>
        <TextField value={record?.email} />

        <Typography variant="body1" fontWeight="bold">{"Phone"}</Typography>
        <TextField value={record?.phone ?? "-"} />
      </Stack>
    </Show>
  );
};
