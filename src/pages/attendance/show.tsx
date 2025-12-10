import { Box, Typography, Chip, Stack } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Show, EditButton } from "@refinedev/mui";
import { useCustom } from "@refinedev/core";
import React from "react";
import { useParams } from "react-router-dom";
import { Attendance } from "../../interfaces/attendance_interface";
import { Student } from "../../interfaces/student_interface";
import { Subject } from "../../interfaces/subject_interface";

export const AttendanceShow = () => {
  const { id } = useParams<{ id: string }>();
  const [subjectId, dateStr] = id?.split('_') || ['', ''];

  const { data: attendancesData, isLoading } = useCustom<Attendance[]>({
    url: `attendances/subject/${subjectId}`,
    method: "get",
    config: { query: { date: dateStr } },
  });

  const { data: studentsData } = useCustom<Student[]>({
    url: "students",
    method: "get",
  });

  const { data: subjectData } = useCustom<Subject>({
    url: `subjects/${subjectId}`,
    method: "get",
  });

  const students = studentsData?.data || [];
  const subject = subjectData?.data;
  const attendances = attendancesData?.data || [];

  const studentMap = React.useMemo(() => {
    const map = new Map<string, Student>();
    students.forEach(s => map.set(s.id, s));
    return map;
  }, [students]);

  const enrichedAttendances = React.useMemo(() => {
    return attendances.map(att => ({
      ...att,
      student_name: studentMap.get(att.student_id)
        ? `${studentMap.get(att.student_id)!.name} ${studentMap.get(att.student_id)!.lastname}`
        : `ID: ${att.student_id}`,
    }));
  }, [attendances, studentMap]);

  const statusColors = {
    present: "success",
    absent: "error",
    late: "warning",
    excused: "info",
  } as const;

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "student_id",
        headerName: "Student ID",
        width: 120,
      },
      {
        field: "student_name",
        headerName: "Student Name",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        renderCell: ({ value }) => (
          <Chip
            label={value.toUpperCase()}
            color={statusColors[value as keyof typeof statusColors]}
            size="small"
          />
        ),
      },
      {
        field: "notes",
        headerName: "Notes",
        flex: 1,
        minWidth: 200,
        renderCell: ({ value }) => value || "-",
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "center",
        headerAlign: "center",
        width: 100,
        sortable: false,
        renderCell: ({ row }) => (
          <EditButton
            hideText
            recordItemId={row.id}
            resource="attendances"
          />
        ),
      },
    ],
    []
  );

  return (
    <Show
      isLoading={isLoading}
      title={
        <Stack spacing={1}>
          <Typography variant="h5">
            {subject?.name || "Loading..."}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dateStr ? new Date(dateStr).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : ""}
          </Typography>
        </Stack>
      }
    >
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={enrichedAttendances}
          columns={columns}
          getRowId={(row) => row.id}
          loading={isLoading}
          disableRowSelectionOnClick
        />
      </Box>
    </Show>
  );
};