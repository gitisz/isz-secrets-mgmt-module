import { Box, Button, Card, CardActions, CardContent, CircularProgress, FormControl, Icon, IconButton, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Table, TableBody, TableCell, TableRow, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { PageComponentProps } from 'isz-app';
import * as React from 'react';
import { useParams, useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { AgGridReact } from 'ag-grid-react';
import UniqueIdCellRenderer from '../Common/UniqueIdCellRenderer';
import { ArrowBack, TaskAlt } from '@mui/icons-material';
import LockboxDetails from '../Common/LockboxDetails';
import axios from 'axios';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';


const AccessManager: React.FC<PageComponentProps> = (props) => {

  const navigation = useHistory();

  const { lockboxId } = useParams();

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
      field: 'accessId',
      headerName: 'Access ID',
      sort: 'desc',
      maxWidth: 160
    },
    {
      field: 'accessType',
      headerName: 'Auth Type',
      maxWidth: 160
    },
    {
      field: 'vaultRole',
      headerName: 'Vault Role',
      cellRenderer: UniqueIdCellRenderer,
    },
    {
      field: 'resourceName',
      headerName: 'Access Target',
      cellRenderer: UniqueIdCellRenderer,
    },
    {
      field: 'permissions',
      headerName: 'Permissions',
      maxWidth: 150
    }
  ]);

  const defaultLockbox = { application: '', name: '', environment: '', lockboxId: '', ownerContact: { eid: '', emailAddress: '' }, components: [] }

  const [selectedLockbox, setSelectedLockbox] = React.useState({
    value: defaultLockbox,
  });

  if (selectedLockbox == undefined) {
    setSelectedLockbox({
      value: defaultLockbox,
    })
  }

  const defaultLockboxAccess = [];

  const [lockboxAccess, setLockboxAccess] = React.useState(defaultLockboxAccess);

  const fetchLockboxAccess = async () => {
    const lockboxRespose = await axios.get(`http://localhost:5001/lockbox/${lockboxId}`);
    setSelectedLockbox({ value: lockboxRespose.data });
    axios.get(`http://localhost:5001/lockboxaccess/accesses/${lockboxRespose.data.lockboxId}`)
      .then((lockboxAccessResponse) => {
        setLockboxAccess(lockboxAccessResponse.data);
      })
      .catch(err => console.error('Seven Hells!'));
  };

  React.useEffect(() => {
    fetchLockboxAccess();
  }, []);

  const [accessType, setAccessType] = React.useState({
    value: '',
    changed: false
  });

  const [resourceName, setResourceName] = React.useState({
    value: '',
    changed: false
  });

  const handleAccessTypeChange = (event: SelectChangeEvent) => {
    setAccessType({ value: event.target.value, changed: true })
  }

  const handleResourceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResourceName({ value: event.target.value, changed: true })
  }

  const handleBackClick = () => {
    navigation.goBack()
  }

  const [accessSavedOpen, setAccessSavedOpen] = React.useState(false);
  const [accessSaving, setAccessSaving] = React.useState(false);

  const handleAccessSaveConfirmed = () => {
    setAccessSaving(true);
    const updateLockboxAccess = async () => {
      await new Promise(f => setTimeout(f, 1000));
      await axios.post(`http://localhost:5001/lockboxaccess/update`, {
        accessType: accessType.value,
        resourceName: resourceName.value,
        lockboxId: lockboxId,
        permissions: ["read"]
      }).then(s => {
        props.piral.showNotification(`Congratulations, your access type has been saved!`, { title: "Access Saved!", type: 'success', autoClose: 10000 });
      }).catch((x) => {
        props.piral.showNotification("Something went wrong!", { title: "Seven Hells!", type: 'error', autoClose: 10000 });
      })
        .finally(() => {
          fetchLockboxAccess();
          setAccessSaving(false);
          setAccessType({ value: '', changed: false })
          setResourceName({ value: '', changed: false })
          setAccessSavedOpen(false);
        });
    };
    updateLockboxAccess();
  }

  const handleSaveAccessConfirm = () => {
    setAccessSavedOpen(true);
  }

  const handleAccessSaveCancel = () => {
    setAccessSavedOpen(false);
  }

  const accessSavedModalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width: 1000,
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, paddingBottom: '10px' }}>
        <Card>
          <CardActions>
            <Box
              display="flex"
              justifyContent="flex-end"
              width='100%'
              onClick={handleBackClick}
            >
              <Tooltip title="Go back" placement="left" arrow>
                <IconButton color="primary">
                  <ArrowBack />
                </IconButton>
              </Tooltip>
            </Box>
          </CardActions>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Access Manager
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ paddingBottom: '20px' }}>
              Take a look at the list of authorization types, access targets, and permissions in the list below.  Don't find one that works for you? Simply select an Access Type and provide a Resource Name to add a new access.
            </Typography>
            <LockboxDetails lockbox={selectedLockbox.value} />
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ height: '527px', width: '100%', paddingBottom: '10px' }}>
        <Box className={`ag-theme-alpine${(theme.palette.mode === 'light') ? '' : '-dark'} top-level`}>
          <AgGridReact
            ref={gridRef}
            rowData={lockboxAccess}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            suppressRowHoverHighlight={true}
            suppressCellFocus={true}
          >
          </AgGridReact>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, paddingBottom: '10px' }}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Add New Access
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ flexGrow: 1 }}>
                <FormControl sx={{ m: 1, width: '50%', marginLeft: '0px', marginright: '0px' }} size="small">
                  <InputLabel id="select-access-type" error={!!!accessType.value && accessType.changed}>Access Type *</InputLabel>
                  <Select
                    id="select-access-type"
                    key="select-access-type"
                    labelId="select-access-type"
                    label="Access Type"
                    required
                    value={accessType.value}
                    onChange={handleAccessTypeChange}
                    error={!!!accessType.value && accessType.changed}
                  >
                    <MenuItem value={""} key="NA">Select...</MenuItem>
                    <MenuItem value={"Iam"} key="Iam">Iam</MenuItem>
                    <MenuItem value={"Ec2"} key="Ec2">Ec2</MenuItem>
                    <MenuItem value={"Ldap"} key="Ldap">Ldap</MenuItem>
                    <MenuItem value={"Approle"} key="Approle">Approle</MenuItem>
                    <MenuItem value={"Shared"} key="Shared">Shared</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flexGrow: 1, paddingLeft: '0px' }}>
                <FormControl sx={{ m: 1, width: '100%', marginLeft: '0px', marginright: '0px' }} size="small">
                  <TextField
                    id="input-resource-name"
                    label="Resource Name"
                    required
                    variant="outlined"
                    size="small"
                    value={resourceName.value}
                    onChange={handleResourceNameChange}
                    error={!!!resourceName.value && resourceName.changed}
                  />
                </FormControl>
              </Box>
            </Box>
          </CardContent>
          <CardActions>
            <Box
              display="flex"
              justifyContent="flex-end"
              width='100%'
              paddingRight='8px'
              paddingBottom='8px'
            >
              <Button
                variant="contained"
                disabled={!!!resourceName.value || !!!accessType.value || accessSavedOpen}
                onClick={handleSaveAccessConfirm}
              >
                Save Access
              </Button>
              <Modal
                hideBackdrop
                open={accessSavedOpen}
                onClose={handleAccessSaveCancel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                  backdropFilter: 'blur(3px)'
                }}
              >
                <Box sx={accessSavedModalStyle}>
                  <Table>
                    <TableBody>
                      <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell
                          sx={{ borderBottom: 'none', paddingLeft: 0 }}
                        >
                          <Typography id="modal-modal-title" variant="h6" component="h2">
                            Please Confirm?
                          </Typography>
                        </TableCell>
                        <TableCell align="right"
                          sx={{ borderBottom: 'none' }}
                        >
                          <TaskAlt
                            color="secondary"
                            sx={{ display: accessSaving ? 'none' : 'visible', fontSize: 36 }} />
                          <CircularProgress
                            size={36}
                            sx={{ display: accessSaving ? 'visible' : 'none' }} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Once added, an access cannot be removed.
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Are you sure you would like to create the requested access?
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    width='100%'
                    paddingTop='8px'
                  >
                    <Button
                      variant="contained"
                      sx={{ width: '80px', margin: '3px' }}
                      disabled={accessSaving}
                      onClick={handleAccessSaveCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ width: '80px', margin: '3px' }}
                      disabled={accessSaving}
                      onClick={handleAccessSaveConfirmed}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Box>
          </CardActions>
        </Card>
      </Box>
    </>
  );
}

export default AccessManager;
