import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import { EnvironmentalData } from '../utils/api';

interface DataTableProps {
  data: EnvironmentalData[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Data Type</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell>Submitted By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{formatDate(row.timestamp)}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.dataType}</TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                  <TableCell>{row.submittedBy}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}; 