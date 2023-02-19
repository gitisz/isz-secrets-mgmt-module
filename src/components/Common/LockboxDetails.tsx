import { Chip, Grid, Paper, styled, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import * as React from 'react';
import UniqueIdCellRenderer from './UniqueIdCellRenderer';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';

const LockboxDetails = (props) => {

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#27272733' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <Typography gutterBottom variant="h5">
        {"Lockbox: " + props.lockbox.name}
      </Typography>
      <Grid container spacing={1} direction="row" columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid component="div" item xs={2} sm={4} md={6}>
          <Item sx={{ boxShadow: "none", flexDirection: 'column', height: '100%' }}>
            <Table size='small'>
              <TableBody>
                <TableRow
                  key={'lockboxId'}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    sx={{ borderBottom: 'none' }}
                  >
                    <Typography variant="subtitle2">Lockbox ID:</Typography>
                  </TableCell>
                  <TableCell align="left"
                    sx={{ borderBottom: 'none' }}
                  >
                    <UniqueIdCellRenderer value={props.lockbox.lockboxId} />
                  </TableCell>
                </TableRow>
                <TableRow
                  key={'asv'}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, border: 0 }}
                >
                  <TableCell
                    sx={{ borderBottom: 'none' }}
                  >
                    <Typography variant="subtitle2">Application:</Typography>
                  </TableCell>
                  <TableCell align="left"
                    sx={{ borderBottom: 'none' }}
                  > {props.lockbox.application}</TableCell>
                </TableRow>
                <TableRow
                  key={'owner-eid'}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, border: 0 }}
                >
                  <TableCell
                    sx={{ borderBottom: 'none' }}
                  >
                    <Typography variant="subtitle2">Owner EID:</Typography>
                  </TableCell>
                  <TableCell align="left"
                    sx={{ borderBottom: 'none' }}
                  > {props.lockbox.ownerContact.eid}</TableCell>
                </TableRow>
                <TableRow
                  key={'owner-emailaddress'}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, border: 0 }}
                >
                  <TableCell
                    sx={{ borderBottom: 'none', }}
                  >
                    <Typography variant="subtitle2">Email Address:</Typography>
                  </TableCell>
                  <TableCell align="left"
                    sx={{ borderBottom: 'none' }}
                  > {props.lockbox.ownerContact.emailAddress}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Item>
        </Grid>
        <Grid item xs={2} sm={4} md={6}>
          <Item sx={{ boxShadow: "none", flexDirection: 'column', height: '100%' }}>
            <Table size='small'>
              <TableBody>
                <TableRow
                  key={'lockboxId'}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, border: 0 }}
                >
                  <TableCell
                    sx={{ borderBottom: 'none' }}
                  >
                    <Typography variant="subtitle2">Components:</Typography>
                  </TableCell>
                  <TableCell align="left"
                    sx={{ borderBottom: 'none' }}
                  >
                    {Array.from(props.lockbox.components).map((item: string, index) => (
                      <Chip key={index} label={item} variant="outlined" sx={{ marginRight: '5px', marginBottom: '2px' }} />
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Item>
        </Grid>
      </Grid>
    </>
  )
}

export default LockboxDetails;
