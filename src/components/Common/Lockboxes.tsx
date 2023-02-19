import { Box, Chip, Grid, Paper, styled, Table, TableBody, TableCell, TableRow, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import UniqueIdCellRenderer from './UniqueIdCellRenderer';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';

const Lockboxes = (props) => {

  const theme = useTheme();

  const gridRef = React.useRef();

  const defaultColDef = React.useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1
  }), []);

  const [columnDefs] = React.useState([
    {
      field: 'application',
      headerName: 'Application',
    },
    {
      field: 'name',
      headerName: 'Loxkbox',
    },
    {
      field: 'environment',
      headerName: 'Environment',
      maxWidth: 140
    },
    {
      field: 'lockboxId',
      headerName: 'Lockbox ID',
      minWidth: 330,
      cellRenderer: UniqueIdCellRenderer,
    }
  ]);

  const [lockboxes, setLockboxes] = React.useState([]);

  React.useEffect(() => {
    axios.get("http://localhost:5001/lockbox/lockboxes")
      .then((res) => {
        console.log(res.data);
        return setLockboxes(res.data)
      })
      .catch(err => console.error('Seven Hells!'))
  }, []);

  const onLockboxSelected = (event) => {
    const selectedLockbox = {
      value: lockboxes.filter((x) => x.lockboxId == event.node.data.lockboxId).at(0),
    };
    props.lockboxSelected(selectedLockbox);
  };

  return (
    <>
      <Box sx={{ height: '500px', width: '100%', paddingBottom: '10px' }}>
        <Box className={`ag-theme-alpine${(theme.palette.mode === 'light') ? '' : '-dark'} top-level`}>
          <AgGridReact
            ref={gridRef}
            rowData={lockboxes}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            suppressCellFocus={true}
            rowSelection={'single'}
            onRowClicked={onLockboxSelected}
          >
          </AgGridReact>
        </Box>
      </Box>
    </>
  );
}

export default Lockboxes;
