import { useShow } from "@refinedev/core";
import {
    Show,
    TextFieldComponent as TextField,
} from "@refinedev/mui";
import { Typography, Stack, Chip, Box, Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

export const AlertShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    const typeLabels: Record<string, string> = {
        risk_of_failure: "Risk of Failure",
        attendance: "Attendance",
        school_event: "School Event",
        holiday: "Holiday",
        grades_published: "Grades Published",
        general: "General",
    };

    return (
        <Show isLoading={isLoading}>
            <Stack gap={1}>
                <Typography variant="body1" fontWeight="bold">
                    ID
                </Typography>
                <TextField value={record?.id ?? ""} />

                <Typography variant="body1" fontWeight="bold">
                    Title
                </Typography>
                <TextField value={record?.title} />

                <Typography variant="body1" fontWeight="bold">
                    Message
                </Typography>
                <Box sx={{ 
                    p: 2, 
                    bgcolor: 'background.paper', 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography>{record?.message}</Typography>
                </Box>

                <Typography variant="body1" fontWeight="bold">
                    Alert Type
                </Typography>
                <Chip 
                    label={typeLabels[record?.alert_type] || record?.alert_type}
                    color="primary"
                />

                <Typography variant="body1" fontWeight="bold">
                    Status
                </Typography>
                <Chip 
                    label={record?.status?.toUpperCase()}
                    color={
                        record?.status === "sent" ? "success" :
                        record?.status === "failed" ? "error" :
                        record?.status === "scheduled" ? "info" : "default"
                    }
                />

                <Typography variant="body1" fontWeight="bold">
                    Channel
                </Typography>
                <Chip 
                    label={record?.channel?.toUpperCase()}
                    variant="outlined"
                />

                <Typography variant="body1" fontWeight="bold">
                    Recipients
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {record?.target_recipients?.map((recipient: string) => (
                        <Chip key={recipient} label={recipient} size="small" />
                    ))}
                </Box>

                <Typography variant="body1" fontWeight="bold">
                    Created At
                </Typography>
                <TextField value={new Date(record?.created_at).toLocaleString()} />

                {record?.scheduled_at && (
                    <>
                        <Typography variant="body1" fontWeight="bold">
                            Scheduled For
                        </Typography>
                        <TextField value={new Date(record?.scheduled_at).toLocaleString()} />
                    </>
                )}

                {record?.sent_at && (
                    <>
                        <Typography variant="body1" fontWeight="bold">
                            Sent At
                        </Typography>
                        <TextField value={new Date(record?.sent_at).toLocaleString()} />
                    </>
                )}

                {record?.status === "draft" && (
                    <Button
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={() => {
                            // Implementar lógica de envío
                            console.log("Send alert", record.id);
                        }}
                    >
                        Send Now
                    </Button>
                )}
            </Stack>
        </Show>
    );
};