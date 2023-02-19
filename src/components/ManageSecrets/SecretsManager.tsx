import { Box, Button, Card, CardActions, CardContent, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { PageComponentProps } from 'isz-app';
import * as React from 'react';
import { useParams, useHistory } from "react-router-dom";
import { ArrowBack } from '@mui/icons-material';
import LockboxDetails from '../Common/LockboxDetails';
import SecretPaths from './SecretPaths';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import AddSecretPath from './AddSecretPath';
import UpdatePathSecret from './UpdatePathSecret';

const SecretsManager: React.FC<PageComponentProps> = (props) => {

  const navigation = useHistory();

  const { lockboxId } = useParams();

  const theme = useTheme();

  const defaultLockbox = { application: '', name: '', environment: '', lockboxId: '', ownerContact: { eid: '', emailAddress: '' }, components: [] }

  const [selectedLockbox, setSelectedLockbox] = React.useState({
    value: defaultLockbox,
  });

  if (selectedLockbox == undefined) {
    setSelectedLockbox({
      value: defaultLockbox,
    })
  }

  React.useEffect(() => {
    const fetchLockbox = async () => {
      const lockboxRespose = await axios.get(`http://localhost:5001/lockbox/${lockboxId}`);
      setSelectedLockbox({ value: lockboxRespose.data });
    };
    fetchLockbox();
  }, []);

  const defaultPath = { pathId: '', lockboxId: '', path: '' }

  const [selectedPath, setSelectedPath] = React.useState({
    value: defaultPath
  });

  const handleBackClick = () => {
    navigation.goBack()
  }

  const handlePathSelected = (path) => {
    setSelectedPath(path);
  };

  const handlePathSaved = () => {
    // TODO: refresh data.
  };

  let childCallables = null;

  const setChildCallables = (callables) => {
    childCallables = callables;
  }

  const handleCancelUpdateSecret = () => {
    setSelectedPath({ value: defaultPath});
    childCallables.clearSelection();
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
              Secrets Manager
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ paddingBottom: '20px' }}>
              Take a look at the list of secret paths below.  If you need to onboard a new application, or are simply enhancing an existing application, you can add new paths and update their secrets as well.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ paddingBottom: '20px' }}>
              To add a new path, just provide the desired path and key in the form below, and then click Save Path.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ paddingBottom: '20px' }}>
              To update a secret for a new path or an exsting path, simply select the path from the list to change into editor mode.  Once the editor form appears, verify your path, provide the new secret, and click Update Secret.
            </Typography>
            <LockboxDetails lockbox={selectedLockbox.value} />
          </CardContent>
        </Card>
      </Box>
      <SecretPaths lockboxId={lockboxId} pathSelected={handlePathSelected} setCallables={setChildCallables}  />
      {!!!selectedPath.value.path && <AddSecretPath pathSaved={handlePathSaved} lockboxId={lockboxId} piral={props.piral} /> }
      {!!selectedPath.value.path && <UpdatePathSecret selectedPath={selectedPath} cancelUpdateSecret={handleCancelUpdateSecret} piral={props.piral} /> }
    </>
  );
}

export default SecretsManager;
