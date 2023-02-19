import * as React from 'react';
import { TaskAlt } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CircularProgress, FormControl, Modal, Table, TableBody, TableCell, TableRow, TextField, Typography, useTheme } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { ghcolors, materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';

export interface LockboxSecretPath {
  path: String;
  no_prefix: Boolean;
}

export interface FormattedSecretPath {
  secret: LockboxSecretPath;
}

const AddSecretPath = (props) => {

  const theme = useTheme();

  const [secretPath, setSecretPath] = React.useState({
    value: '',
    isValid: false,
    changed: false
  });

  const [secretPathSavedOpen, setSecretPathSavedOpen] = React.useState(false);
  const [secretPathSaving, setSecretPathSaving] = React.useState(false);
  const [formattedSecretPath, setFormattedSecretPath] = React.useState({} as FormattedSecretPath);

  const formatSecretPath = (secretPath: { value: string; changed: boolean; }) => {
    let fsp = secretPath.value.replace(props.lockboxId, "");
    if (!fsp.startsWith("/")) {
      fsp = '/' + fsp;
    }
    fsp = props.lockboxId + fsp;
    const fmtSp = { secret: { path: fsp, no_prefix: true } } as FormattedSecretPath;
    setFormattedSecretPath(fmtSp);
  }

  const handleSecretPathSaveConfirmed = () => {
    setSecretPathSaving(true);
    const saveSecretPath = async () => {
      await new Promise(f => setTimeout(f, 1000));
      await axios.post(`http://localhost:5001/lockboxsecretpath/update`, {
        path: formattedSecretPath.secret.path,
        lockboxId: props.lockboxId
      }).then(s => {
        props.piral.showNotification(`Your secret path has been added... but don't forget to update it with a secret!`, { title: "Secret Path Saved!", type: 'success', autoClose: 10000 });
      }).catch((x) => {
        props.piral.showNotification(x.response.data, { title: "Seven Hells!", type: 'error', autoClose: 10000 });
      })
        .finally(() => {
          setSecretPathSaving(false);
          setSecretPath({ value: '', changed: false, isValid: false })
          setSecretPathSavedOpen(false);
          props.pathSaved();
        });
    };
    saveSecretPath();
  }

  const handleSecretPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex: RegExp = /^\w+([\s-_\/]\w+)*$/;
    const validatedSecretPath = { value: event.target.value, changed: true, isValid: regex.test(event.target.value) };
    setSecretPath(validatedSecretPath);
  }

  const handleSaveSecretPathConfirm = () => {
    formatSecretPath(secretPath);
    setSecretPathSavedOpen(true);
  }

  const handleSecretPathSaveCancel = () => {
    setSecretPathSavedOpen(false);
  }

  const secretPathSavedModalStyle = {
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
      <Box sx={{ flexGrow: 1, paddingBottom: '10px', visibility: props.visibility }} >
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Add Secret Path
            </Typography>
            <Typography sx={{ fontStyle: 'italic' }}>
              Note: it is not necessary to prepend the lockbox ID to the path (although it won't hurt if you do)... we'll take care of that for you!
            </Typography>
            <Box sx={{ flexGrow: 1, paddingTop: '5px' }}>
              <Box sx={{ flexGrow: 1, paddingLeft: '0px' }}>
                <FormControl sx={{ m: 1, width: '100%', marginLeft: '0px', marginright: '0px' }} size="small">
                  <TextField
                    id="input-resource-name"
                    label="Secret Path"
                    variant="outlined"
                    size="small"
                    value={secretPath.value}
                    onChange={handleSecretPathChange}
                    error={(!!!secretPath.value && secretPath.changed) || (secretPath.changed && !secretPath.isValid)}
                    required
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
                disabled={!!!secretPath.value || !!!secretPath.value || secretPathSavedOpen}
                onClick={handleSaveSecretPathConfirm}
              >
                Save Path
              </Button>
              <Modal
                hideBackdrop
                open={secretPathSavedOpen}
                onClose={handleSecretPathSaveCancel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                  backdropFilter: 'blur(3px)'
                }}
              >
                <Box sx={secretPathSavedModalStyle}>
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
                            sx={{ display: secretPathSaving ? 'none' : 'visible', fontSize: 36 }} />
                          <CircularProgress
                            size={36}
                            sx={{ display: secretPathSaving ? 'visible' : 'none' }} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    You're adding a secret path to Lockbox: <span style={{ fontFamily: 'courier', color: theme.palette.secondary.main }}>{props.lockboxId}</span>
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Once added, a secret path cannot be removed.
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Are you sure you would like to create the requested secret path?
                  </Typography>
                  <Box
                    display="flex"
                    width='100%'
                    height='170px'
                    paddingTop='8px'
                  >
                    <SyntaxHighlighter
                      language="javascript"
                      style={(theme.palette.mode === 'light') ? ghcolors : materialDark}
                      customStyle={{ fontSize: (theme.palette.mode === 'light') ? '.9rem' : '.8rem', width: 'inherit', borderRadius: 2 }} >
                      {JSON.stringify(formattedSecretPath, undefined, 4)}
                    </SyntaxHighlighter>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    width='100%'
                    paddingTop='8px'
                  >
                    <Button
                      variant="contained"
                      sx={{ width: '80px', margin: '3px' }}
                      disabled={secretPathSaving}
                      onClick={handleSecretPathSaveCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ width: '80px', margin: '3px' }}
                      disabled={secretPathSaving}
                      onClick={handleSecretPathSaveConfirmed}
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
  )
}

export default AddSecretPath;

