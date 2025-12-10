import { Box, Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { List, ShowButton } from "@refinedev/mui";
import React from "react";
import { useCustom } from "@refinedev/core";
import { AttendanceSession } from "../../interfaces/attendance_interface";
import { Subject } from "../../interfaces/subject_interface";
import { getAttendanceSessions } from "../../api/api_attendance";

export const AttendanceList = () => {
  const [sessions, setSessions] = React.useState<AttendanceSession[]>([]);
  const [loading, setLoading] = React.useState(true);

  const { data: subjectsData } = useCustom<Subject[]>({
    url: "subjects",
    method: "get",
  });

  const subjects = subjectsData?.data || [];
  const subjectMap = React.useMemo(() => {
    const map = new Map<string, string>();
    subjects.forEach(s => map.set(s.id, s.name));
    return map;
  }, [subjects]);

  React.useEffect(() => {
    getAttendanceSessions()
      .then((data) => {
        const enriched = data.map(session => ({
          ...session,
          subject_name: subjectMap.get(session.subject_id) || `ID: ${session.subject_id}`
        }));
        setSessions(enriched);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [subjectMap]);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "subject_name",
        headerName: "Subject",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        minWidth: 150,
        renderCell: ({ value }) => {
          return new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        },
      },
      {
        field: "total_students",
        headerName: "Total",
        width: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "present_count",
        headerName: "Present",
        width: 100,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <Chip label={value} color="success" size="small" />
        ),
      },
      {
        field: "absent_count",
        headerName: "Absent",
        width: 100,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <Chip label={value} color="error" size="small" />
        ),
      },
      {
        field: "late_count",
        headerName: "Late",
        width: 100,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <Chip label={value} color="warning" size="small" />
        ),
      },
      {
        field: "excused_count",
        headerName: "Excused",
        width: 100,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <Chip label={value} color="info" size="small" />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "center",
        headerAlign: "center",
        width: 120,
        sortable: false,
        renderCell: ({ row }) => (
          <ShowButton
            hideText
            recordItemId={`${row.subject_id}_${row.date}`}
          />
        ),
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid
        rows={sessions}
        columns={columns}
        getRowId={(row) => `${row.subject_id}_${row.date}`}
        loading={loading}
      />
    </List>
  );
};