import React from "react";
import {
  useDataGrid,
  EditButton,
  ShowButton,
  DeleteButton,
  List,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Chip, Box, IconButton, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useNotification } from "@refinedev/core";
import { sendAlert } from "../../api/api_alert";

export const AlertList = () => {
  const { dataGridProps } = useDataGrid({
    resource: "alerts",
    pagination: {
      mode: "server",
    },
    sorters: {
      initial: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
    },
  });

  const { open } = useNotification();

  const handleSendAlert = async (id: number) => {
    try {
      await sendAlert(id);

      open?.({
        type: "success",
        message: "Alert sent successfully",
      });
    } catch (error) {
      open?.({
        type: "error",
        message: "Error sending alert",
      });
    }
  };

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        minWidth: 50,
      },
      {
        field: "title",
        headerName: "Title",
        minWidth: 200,
        flex: 1,
      },
      {
        field: "alert_type",
        headerName: "Type",
        minWidth: 150,
        renderCell: function render({ value }) {
          const typeColors: Record<string, any> = {
            risk_of_failure: "error",
            attendance: "warning",
            school_event: "info",
            holiday: "default",
            grades_published: "success",
            general: "primary",
          };

          const typeLabels: Record<string, string> = {
            risk_of_failure: "Risk of Failure",
            attendance: "Attendance",
            school_event: "School Event",
            holiday: "Holiday",
            grades_published: "Grades Published",
            general: "General",
          };

          return (
            <Chip
              label={typeLabels[value] || value}
              color={typeColors[value]}
              size="small"
            />
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 120,
        renderCell: function render({ value }) {
          const statusColors: Record<string, any> = {
            draft: "default",
            scheduled: "info",
            sent: "success",
            failed: "error",
          };

          return (
            <Chip
              label={value?.toUpperCase()}
              color={statusColors[value]}
              size="small"
            />
          );
        },
      },
      {
        field: "channel",
        headerName: "Channel",
        minWidth: 100,
        renderCell: function render({ value }) {
          return (
            <Chip
              label={value?.toUpperCase()}
              variant="outlined"
              size="small"
            />
          );
        },
      },
      {
        field: "created_at",
        headerName: "Created",
        minWidth: 150,
        renderCell: function render({ value }) {
          return new Date(value).toLocaleDateString();
        },
      },
      {
        field: "scheduled_at",
        headerName: "Scheduled",
        minWidth: 150,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleString() : "-";
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        minWidth: 200,
        renderCell: function render({ row }) {
          return (
            <Box sx={{ display: "flex", gap: 1 }}>
              <ShowButton hideText recordItemId={row.id} />
              {row.status !== "sent" && (
                <EditButton hideText recordItemId={row.id} />
              )}
              {row.status === "draft" && (
                <Tooltip title="Send Now">
                  <IconButton
                    color="primary"
                    onClick={() => handleSendAlert(row.id)}
                  >
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              )}
              <DeleteButton hideText recordItemId={row.id} />
            </Box>
          );
        },
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
