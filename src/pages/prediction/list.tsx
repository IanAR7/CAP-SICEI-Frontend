import React, { useState } from "react";
import { List } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Button, Box, Typography, Alert } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { uploadBatchPrediction } from "../../api/api_predictions";
import { StudentRiskReport, BatchUploadResponse } from "../../interfaces/risk_student";

export const PredictionReportsList = () => {
  const [processed, setProcessed] = useState<StudentRiskReport[]>([]);
  const [notFound, setNotFound] = useState<BatchUploadResponse["not_found"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "lastname", headerName: "Lastname", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "semester", headerName: "Semester", width: 120 },
    {
      field: "risk_status",
      headerName: "Risk",
      width: 140,
      renderCell: ({ value }) => (
        <Typography fontWeight="bold" color={
          value === "CRÍTICO" ? "error" :
          value === "Medio" ? "warning.main" :
          "success.main"
        }>
          {value}
        </Typography>
      ),
    },
    { field: "probability", headerName: "Probability", width: 130 },
  ];

  const handleFileChange = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const res = await uploadBatchPrediction(file);
      setProcessed(res.processed);
      setNotFound(res.not_found);
    } catch (e: any) {
      console.error("Upload error", e);
      setError("Error uploading CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <List
      title="Prediction Reports"
      headerButtons={() => (
        <Box mb={2}>
          <Button variant="contained" startIcon={<UploadFileIcon />} component="label">
            Upload CSV
            <input
              hidden
              type="file"
              accept=".csv"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
          </Button>
        </Box>
      )}
    >
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={processed}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          autoHeight
          localeText={{
            noRowsLabel: "No predictions yet. Upload a CSV to begin.",
          }}
        />
      </Box>

      {notFound.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6">Students not found</Typography>
          {notFound.map((student) => (
            <Alert key={student.id} severity="warning" sx={{ mt: 1 }}>
              Student <strong>{student.name} {student.lastname}</strong> (ID {student.id}) not found.
            </Alert>
          ))}
        </Box>
      )}
    </List>
  );
};
