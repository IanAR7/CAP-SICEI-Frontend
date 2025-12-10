import { Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";

import { Professor } from "../../interfaces/professor_interface";

export const ProfessorList = () => {
  const { dataGridProps } = useDataGrid<Professor>();

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        flex: 1,
        minWidth: 50,
        display: "flex",
        align: "left",
        headerAlign: "left",
      },
      {
        field: "first_name",
        flex: 1,
        headerName: "First Name",
        minWidth: 150,
      },
      {
        field: "last_name",
        flex: 1,
        headerName: "Last Name",
        minWidth: 150,
      },
      {
        field: "email",
        flex: 1,
        headerName: "Email",
        minWidth: 200,
        display: "flex",
        renderCell: function render({ value }) {
          return (
            <Typography
              component="p"
              whiteSpace="pre"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {value ?? "-"}
            </Typography>
          );
        },
      },
      {
        field: "phone",
        flex: 1,
        headerName: "Phone",
        minWidth: 50,
        type: "number",
        display: "flex",
        align: "left",
        headerAlign: "left",
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "right",
        headerAlign: "right",
        minWidth: 120,
        sortable: false,
        renderCell: ({ row }) => (
          <>
            <EditButton hideText recordItemId={row.id} />
            <ShowButton hideText recordItemId={row.id} />
            <DeleteButton
              hideText
              recordItemId={row.id}
              confirmTitle={`Are you sure you want to delete professor: ${row.first_name} ${row.last_name}?`}
            />
          </>
        ),
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
