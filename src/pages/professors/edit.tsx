import { Box, TextField } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "react-router-dom";

import { Professor } from "../../interfaces/professor_interface";

type FormValues = Omit<Professor, "id">;

export const ProfessorEdit = () => {
  const { id } = useParams<{ id: string }>();

  const {
    saveButtonProps,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    refineCoreProps: {
      action: "edit",
      id: id,
      resource: "professors",
    },
  });

  return (
    <Edit isLoading={false} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        {/* First Name */}
        <TextField
          {...register("first_name", {
            required: "This field is required",
          })}
          error={!!errors?.first_name}
          helperText={
            typeof errors.first_name?.message === "string"
              ? errors.first_name.message
              : ""
          }
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          type="text"
          label="First Name"
          name="first_name"
        />

        {/* Last Name */}
        <TextField
          {...register("last_name", {
            required: "This field is required",
          })}
          error={!!errors?.last_name}
          helperText={
            typeof errors.last_name?.message === "string"
              ? errors.last_name.message
              : ""
          }
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          type="text"
          label="Last Name"
          name="last_name"
        />

        {/* Email */}
        <TextField
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          error={!!errors?.email}
          helperText={
            typeof errors.email?.message === "string"
              ? errors.email.message
              : ""
          }
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          type="email"
          label="Email"
          name="email"
        />

        {/* Phone */}
        <TextField
          {...register("phone")}
          error={!!errors?.phone}
          helperText={
            typeof errors.phone?.message === "string"
              ? errors.phone.message
              : ""
          }
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          type="text"
          label="Phone"
          name="phone"
        />
      </Box>
    </Edit>
  );
};
