import { Box, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

import { Professor } from "../../interfaces/professor_interface";

type FormValues = Omit<Professor, "id">;

export const ProfessorCreate = () => {

  const {
    saveButtonProps,
    register,
    formState: { errors },
    refineCore: { formLoading },
  } = useForm<FormValues>({
    refineCoreProps: {
      resource: "professors",
      action: "create",
    },
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >

        <TextField
          {...register("first_name", { required: "This field is required" })}
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
          margin="normal"
          fullWidth
          label="First Name"
        />

        <TextField
          {...register("last_name", { required: "This field is required" })}
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
          margin="normal"
          fullWidth
          label="Last Name"
        />

        <TextField
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          margin="normal"
          fullWidth
          label="Email"
        />

        <TextField
          {...register("phone")}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          margin="normal"
          fullWidth
          label="Phone"
        />
      </Box>
    </Create>
  );
};
