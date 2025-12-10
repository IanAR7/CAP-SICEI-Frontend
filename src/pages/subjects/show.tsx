import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { useEffect, useState } from "react";

import { Subject } from "../../interfaces/subject_interface";
import { Professor } from "../../interfaces/professor_interface";
import { getProfessorById } from "../../api/api_professors";

export const SubjectShow = () => {
  const { query } = useShow<Subject>();

  const { data, isLoading } = query;
  const record = data?.data;

  const [professor, setProfessor] = useState<Professor | null>(null);

  useEffect(() => {
    if (record?.professor_id) {
      getProfessorById(record.professor_id)
        .then((data) => setProfessor(data))
        .catch((err) => console.error("Error loading professor:", err));
    }
  }, [record?.professor_id]);

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">ID</Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">Name</Typography>
        <TextField value={record?.name} />

        <Typography variant="body1" fontWeight="bold">Description</Typography>
        <TextField value={record?.description} />

        <Typography variant="body1" fontWeight="bold">Credits</Typography>
        <TextField value={record?.credits} />

        <Typography variant="body1" fontWeight="bold">Semester</Typography>
        <TextField value={record?.semester} />

        <Typography variant="body1" fontWeight="bold">Assigned Professor</Typography>
        <TextField
          value={
            professor
              ? `${professor.first_name} ${professor.last_name}`
              : "Loading..."
          }
        />
      </Stack>
    </Show>
  );
};
