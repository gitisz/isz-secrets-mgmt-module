import { Box, Button, CircularProgress, Modal, Table, TableBody, TableCell, TableRow, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Code, FileDownload, TaskAlt } from '@mui/icons-material';
import UniqueIdCellRenderer from '../Common/UniqueIdCellRenderer';
import axios from 'axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { ghcolors, materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';


const SecretPaths = (props) => {

  const gridRef = React.useRef();

  const clearSelection = () => {
    gridRef.current.api.deselectAll()
  }

  props.setCallables({
    clearSelection: clearSelection
  });

  const theme = useTheme();

  const defaultColDef = React.useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1
  }), []);

  const [columnDefs] = React.useState([
    {
      field: 'pathId',
      headerName: 'Path ID',
      sort: 'desc',
      maxWidth: 160,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      field: 'path',
      headerName: 'Secret Path',
      cellRenderer: UniqueIdCellRenderer,
    }
  ]);

  const defaultLockboxSecrets = [];

  const [lockboxSecrets, setLockboxSecrets] = React.useState(defaultLockboxSecrets);

  React.useEffect(() => {
    const fetchLockboxSecrets = async () => {
      const lockboxRespose = await axios.get(`http://localhost:5001/lockbox/${props.lockboxId}`);
      axios.get(`http://localhost:5001/lockboxsecretpath/secretpaths/${lockboxRespose.data.lockboxId}`)
        .then((lockboxSecretsResponse) => {
          setLockboxSecrets(lockboxSecretsResponse.data);
        })
        .catch(err => console.error('Seven Hells!'));
    };
    fetchLockboxSecrets();
  }, []);

  const onSecretPathSelected = (event) => {
    console.log(event);
    if (event.event.defaultPrevented) {
      event.node.setSelected(false, false, true);
      return;
    }
    const selectedPath = {
      value: lockboxSecrets.filter((x) => x.pathId == event.node.data.pathId).at(0),
    };
    props.pathSelected(selectedPath);
  };

  const [selectedSecretpaths, setSelectedSecretPaths] = React.useState([]);

  const onSelectionChanged = (event) => {
    setSelectedSecretPaths(event.api.getSelectedNodes().map((s) => { return s.data }));
  };

  const [generateConfigOpen, setGenerateConfigOpen] = React.useState(false);
  const [generateConfigSaving, setGenerateConfigSaving] = React.useState(false);
  const [secretPathsCodeString, setSecretPathsCodeString] = React.useState('');

  const handleGenerateConfigConfirm = () => {
    console.log(selectedSecretpaths);
    const keyData = Object.fromEntries(selectedSecretpaths.map(({ pathId, ...rest }) => (["REGEX" + pathId + "REGEX", { path: rest.path, no_prefix: true }])));

    let envConsulConfig = JSON.stringify({
      vault: {
        renew_token: false,
        ssl: {
          enabled: true,
          verify: true
        }
      },
      ...keyData
    }, undefined, 4);
    envConsulConfig = envConsulConfig.replace(/\b(REGEX)\d+(REGEX)/g, "secret")
    setSecretPathsCodeString(envConsulConfig);
    setGenerateConfigOpen(true);
  }

  const handleGenerateConfigCancel = () => {
    setGenerateConfigOpen(false);
  }

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType })
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  const handleGenerateConfigConfirmed = (e) => {
    e.preventDefault()
    downloadFile({
      data: secretPathsCodeString,
      fileName: 'envconsul.json',
      fileType: 'text/json',
    });
    setGenerateConfigSaving(true);
    setGenerateConfigSaving(false);
    setGenerateConfigOpen(false);
  };

  const generateConfigModalStyle = {
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
      <Box sx={{ height: '615px', width: '100%', paddingBottom: '10px', bgcolor: 'background.paper' }}>
        <Box className={`ag-theme-alpine${(theme.palette.mode === 'light') ? '' : '-dark'} top-level`}>
          <Box sx={{ paddingLeft: '15px', paddingTop: '10px' }}>
            <Table>
              <TableBody>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    sx={{ borderBottom: 'none', paddingLeft: 0 }}
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      Secret Paths
                    </Typography>
                  </TableCell>
                  <TableCell align="right"
                    sx={{ borderBottom: 'none' }}
                  >
                    <Button
                      variant="text"
                      startIcon={<Code />}
                      sx={{ margin: '3px' }}
                      disabled={selectedSecretpaths.length == 0}
                      onClick={handleGenerateConfigConfirm}
                    >
                      Generate Config
                    </Button>
                    <Modal
                      hideBackdrop
                      open={generateConfigOpen}
                      onClose={handleGenerateConfigCancel}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      sx={{
                        backdropFilter: 'blur(3px)'
                      }}
                    >
                      <Box sx={generateConfigModalStyle}>
                        <Table>
                          <TableBody>
                            <TableRow
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell
                                sx={{ borderBottom: 'none', paddingLeft: 0 }}
                              >
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                  Generated Config
                                </Typography>
                              </TableCell>
                              <TableCell align="right"
                                sx={{ borderBottom: 'none' }}
                              >
                                <Code
                                  color="primary"
                                  sx={{ display: generateConfigSaving ? 'none' : 'visible', fontSize: 36 }} />
                                <CircularProgress
                                  size={36}
                                  sx={{ display: generateConfigSaving ? 'visible' : 'none' }} />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          We've generated Consul configuration files to help you easily download and save to your application.
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          The paths below are based upon selections you made previously.  If you would like to add or remove secret paths, just cancel and change your selection.
                        </Typography>
                        <Box
                          display="flex"
                          width='100%'
                          height='500px'
                          paddingTop='8px'
                        >
                          <SyntaxHighlighter language="javascript" style={(theme.palette.mode === 'light') ? ghcolors : materialDark } customStyle={{ fontSize: '.8rem', width: 'inherit', borderRadius: 2 }} >
                            {secretPathsCodeString}
                          </SyntaxHighlighter>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          width='100%'
                          paddingRight='0px'
                          paddingTop='8px'
                          paddingBottom='8px'
                        >
                          <Button
                            variant="contained"
                            sx={{ width: '125px', margin: '3px' }}
                            disabled={generateConfigSaving}
                            onClick={handleGenerateConfigCancel}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<FileDownload />}
                            sx={{ width: '125px', margin: '3px' }}
                            disabled={generateConfigSaving}
                            onClick={handleGenerateConfigConfirmed}
                          >
                            Download
                          </Button>
                        </Box>
                      </Box>
                    </Modal>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <AgGridReact
            ref={gridRef}
            rowData={lockboxSecrets}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            suppressCellFocus={true}
            rowSelection={'multiple'}
            onRowClicked={onSecretPathSelected}
            onSelectionChanged={onSelectionChanged}
          >
          </AgGridReact>
        </Box>
      </Box>
    </>
  );
}

export default SecretPaths;
