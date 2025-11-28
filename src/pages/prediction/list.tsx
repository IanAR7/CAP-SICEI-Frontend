import React from "react";
import { useDataGrid, List } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Typography, Button, Box } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { RiskStudent } from "../../interfaces/risk_student";

export const PredictionReportsList = () => {
  const { dataGridProps } = useDataGrid<RiskStudent>();

  const columns = React.useMemo<GridColDef[]>(() => [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "lastname",
      headerName: "Lastname",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: ({ value }) => (
        <Typography noWrap>{value ?? "-"}</Typography>
      ),
    },
    {
      field: "semester",
      headerName: "Semester",
      width: 120,
    },
    {
      field: "isAtRisk",
      headerName: "Risk Status",
      width: 150,
      renderCell: ({ value }) => (
        <Typography
          color={value ? "error" : "success.main"}
          fontWeight="bold"
        >
          {value ? "At Risk" : "Safe"}
        </Typography>
      ),
    },
  ], []);

  return (
    <List
      headerButtons={() => (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            component="label"
          >
            Upload CSV
            <input
              hidden
              type="file"
              accept=".csv"
              onChange={(e) => console.log(e.target.files)}
            />
          </Button>
        </Box>
      )}
    >
      <DataGrid
        {...dataGridProps}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
      />
    </List>
  );
};
