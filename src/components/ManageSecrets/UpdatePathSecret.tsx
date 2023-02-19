import * as React from 'react';
import { TaskAlt } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CircularProgress, FormControl, Modal, Table, TableBody, TableCell, TableRow, TextField, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import UniqueIdCellRenderer from '../Common/UniqueIdCellRenderer';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { ghcolors, materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface Secret {
  key: String;
  value: string;
}

export interface FormattedSecret {
  pathId: String
  secrets: Secret[];
}

const UpdatePathSecret = (props) => {

  const theme = useTheme();

  const [secret, setSecret] = React.useState({
    value: '',
    changed: false
  });

  const [secretSavedOpen, setSecretSavedOpen] = React.useState(false);
  const [secretSaving, setSecretSaving] = React.useState(false);
  const [formattedSecret, setFormattedSecret] = React.useState({} as FormattedSecret);

  const formatSecret = (secret: { value: string; changed: boolean; }) => {
    console.log(props.selectedPath)
    const fmtScrt = {
      pathId: props.selectedPath.value.pathId,
      secrets: [
        {
          key: props.selectedPath.value.path.split('/').pop(),
          value: '***************'
        }
      ]
    } as FormattedSecret;
    setFormattedSecret(fmtScrt);
  }

  const handleSecretSaveConfirmed = () => {
    setSecretSaving(true);
    const saveSecret = async () => {
      await new Promise(f => setTimeout(f, 1000));
      await axios.post(`http://localhost:5001/lockboxsecret/update`, {
        pathId: props.selectedPath.value.pathId,
        secrets: [{ key: props.selectedPath.value.path.split('/').pop(), value: secret.value }]
      }).then(s => {
        props.piral.showNotification(`Your secret has been updated!`, { title: "Secret Updated!", type: 'success', autoClose: 10000 });
      }).catch((x) => {
        props.piral.showNotification(x.response.data, { title: "Seven Hells!", type: 'error', autoClose: 10000 });
      })
        .finally(() => {
          setSecretSaving(false);
          setSecret({ value: '', changed: false })
          setSecretSavedOpen(false);
          props.cancelUpdateSecret();
        });
    };
    saveSecret();
  }

  const handleSecretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex: RegExp = /^\w+([\s-_\/]\w+)*$/;
    const validatedSecret = { value: event.target.value, changed: true, isValid: regex.test(event.target.value) };
    setSecret(validatedSecret);
  }

  const handleSaveSecretConfirm = () => {
    formatSecret(secret);
    setSecretSavedOpen(true);
  }

  const handleSecretSaveCancel = () => {
    props.cancelUpdateSecret();
    setSecretSavedOpen(false);
  }

  const secretSavedModalStyle = {
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
              Update Secret
            </Typography>
            <Typography gutterBottom variant="body2" component="div">
              <Table size='small'>
                <TableBody>
                  <TableRow
                    key={'lockboxId'}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      sx={{ borderBottom: 'none' }}
                    >
                      <Typography variant="subtitle2">Path:</Typography>
                    </TableCell>
                    <TableCell align="left"
                      sx={{ borderBottom: 'none' }}
                    >
                      <UniqueIdCellRenderer value={props.selectedPath.value.lockboxId} />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    key={'lockboxPath'}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      sx={{ borderBottom: 'none' }}
                    >
                      <Typography variant="subtitle2">Secret :</Typography>
                    </TableCell>
                    <TableCell align="left"
                      sx={{ borderBottom: 'none' }}
                    >
                      <UniqueIdCellRenderer value={props.selectedPath.value.path} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ flexGrow: 1, paddingLeft: '0px' }}>
                <FormControl sx={{ m: 1, width: '50%', marginLeft: '0px', marginright: '0px' }} size="small">
                  <TextField
                    id="input-secret"
                    label="Secret"
                    variant="outlined"
                    size="small"
                    onChange={handleSecretChange}
                    error={!!!secret.value && secret.changed}
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
                onClick={handleSecretSaveCancel}
                sx={{ marginRight: '8px' }}
              >
                Cancel Update
              </Button>
              <Button
                variant="contained"
                disabled={!!!secret.value || !!!secret.value}
                onClick={handleSaveSecretConfirm}
              >
                Update Secret
              </Button>
            </Box>

            <Modal
              hideBackdrop
              open={secretSavedOpen}
              onClose={handleSecretSaveCancel}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{
                backdropFilter: 'blur(3px)'
              }}
            >
              <Box sx={secretSavedModalStyle}>
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
                          sx={{ display: secretSaving ? 'none' : 'visible', fontSize: 36 }} />
                        <CircularProgress
                          size={36}
                          sx={{ display: secretSaving ? 'visible' : 'none' }} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  You're updating a secret on the path: <span style={{ fontFamily: 'courier', color: theme.palette.secondary.main }}>{props.selectedPath.value.path}</span>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Secrets can only be updated.  They cannot be read back, except by the application with an appropriate auth type.
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Are you sure you would like to update the secret for the requested secret path?
                </Typography>
                <Box
                  display="flex"
                  width='100%'
                  height='210px'
                  paddingTop='8px'
                >
                  <SyntaxHighlighter
                    language="javascript"
                    style={(theme.palette.mode === 'light') ? ghcolors : materialDark}
                    customStyle={{ fontSize: (theme.palette.mode === 'light') ? '.9rem' : '.8rem', width: 'inherit', borderRadius: 2 }} >
                    {JSON.stringify(formattedSecret, undefined, 4)}
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
                    disabled={secretSaving}
                    onClick={handleSecretSaveCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ width: '80px', margin: '3px' }}
                    disabled={secretSaving}
                    onClick={handleSecretSaveConfirmed}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Modal>

          </CardActions>
        </Card>
      </Box>
    </>
  )
}

export default UpdatePathSecret;
