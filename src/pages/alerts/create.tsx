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
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";

export const AlertCreate = () => {
    const {
        saveButtonProps,
        refineCore: { formLoading },
        register,
        control,
        formState: { errors },
    } = useForm();

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
                />

                <Controller
                    control={control}
                    name="alert_type"
                    rules={{ required: "This field is required" }}
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
                    name="target_recipients"
                    rules={{ required: "This field is required" }}
                    defaultValue={[]}
                    render={({ field }) => (
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Recipients (emails/phones)</InputLabel>
                            <Select
                                {...field}
                                multiple
                                input={<OutlinedInput label="Recipients" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value: string) => (
                                            <Chip key={value} label={value} size="small" />
                                        ))}
                                    </Box>
                                )}
                            >
                                {/* Aquí deberías cargar destinatarios desde la API */}
                                <MenuItem value="parent1@example.com">Parent 1</MenuItem>
                                <MenuItem value="parent2@example.com">Parent 2</MenuItem>
                                <MenuItem value="teacher1@example.com">Teacher 1</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />

                <TextField
                    {...register("scheduled_at")}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="datetime-local"
                    label="Schedule For (Optional)"
                    name="scheduled_at"
                />

                <input
                    type="hidden"
                    {...register("created_by")}
                    value="admin001" // TODO: Obtener del usuario autenticado
                />
            </Box>
        </Create>
    );
};