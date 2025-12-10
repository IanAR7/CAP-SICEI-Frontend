import { Box, TextField, MenuItem } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Subject } from "../../interfaces/subject_interface";
import { Professor } from "../../interfaces/professor_interface";
import { getAllProfessors } from "../../api/api_professors";

type FormValues = Omit<Subject, "id">;

export const SubjectEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [professors, setProfessors] = useState<Professor[]>([]);

  const {
    saveButtonProps,
    register,
    watch,
    formState: { errors },
    refineCore: { formLoading },
  } = useForm<FormValues>({
    refineCoreProps: {
      action: "edit",
      id: id,
      resource: "subjects",
    },
  });

  const currentProfessorId = watch("professor_id");


  useEffect(() => {
    getAllProfessors()
      .then((data) => setProfessors(data))
      .catch((err) => console.error("Error loading professors:", err));
  }, []);

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          error={!!errors?.name}
          helperText={errors.name?.message || ""}
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Name"
        />

        <TextField
          {...register("description")}
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Description"
        />

        <TextField
          {...register("credits", {
            required: "This field is required",
            min: { value: 1, message: "Credits must be at least 1" },
            max: { value: 10, message: "Credits must be at most 10" },
          })}
          error={!!errors.credits}
          helperText={errors.credits?.message || ""}
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          type="number"
          inputProps={{ min: 1, max: 10 }}
          label="Credits"
        />

        <TextField
          {...register("semester", {
            required: "This field is required",
            min: { value: 1, message: "Semester must be at least 1" },
            max: { value: 10, message: "Semester must be at most 10" },
          })}
          error={!!errors.semester}
          helperText={errors.semester?.message || ""}
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          type="number"
          inputProps={{ min: 1, max: 10 }}
          label="Semester"
        />

        {/* Select Professor */}
        <TextField
          select
          {...register("professor_id", {
            required: "A professor is required",
          })}
          value={currentProfessorId || ""}
          error={!!errors.professor_id}
          helperText={errors.professor_id?.message || ""}
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Assigned Professor"
        >
          <MenuItem value="" disabled>
            <em>Select a professor</em>
          </MenuItem>

          {professors.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.first_name} {p.last_name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Edit>
  );
};
