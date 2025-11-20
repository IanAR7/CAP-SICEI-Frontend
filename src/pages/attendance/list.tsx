import { Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";

import { Attendance } from "../../interfaces/attendance_interface";

export const AttendanceList = () => {
  const { dataGridProps } = useDataGrid<Attendance>();

  const statusColors = {
    present: "success",
    absent: "error",
    late: "warning",
    excused: "info",
  } as const;

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "string",
        minWidth: 100,
        display: "flex",
        align: "left",
        headerAlign: "left",
      },
      {
        field: "student_id",
        flex: 1,
        headerName: "Student ID",
        minWidth: 150,
        display: "flex",
      },
      {
        field: "subject_id",
        flex: 1,
        headerName: "Subject ID",
        minWidth: 150,
        display: "flex",
      },
      {
        field: "date",
        flex: 1,
        headerName: "Date",
        minWidth: 180,
        display: "flex",
        renderCell: function render({ value }) {
          return new Date(value).toLocaleString();
        },
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 120,
        display: "flex",
        renderCell: function render({ value }) {
          return (
            <Chip 
              label={value.toUpperCase()} 
              color={statusColors[value as keyof typeof statusColors]}
              size="small"
            />
          );
        },
      },
      {
        field: "notes",
        flex: 1,
        headerName: "Notes",
        minWidth: 200,
        display: "flex",
        renderCell: function render({ value }) {
          return value || "-";
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "right",
        headerAlign: "right",
        minWidth: 120,
        sortable: false,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton
                hideText
                recordItemId={row.id}
                confirmTitle={`Are you sure you want to delete this attendance record?`}
              />
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        getRowId={(row) => row.id}
      />
    </List>
  );
};