import { DataObject, VerifiedUser } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { useHistory } from "react-router-dom";
import { PageComponentProps } from 'isz-app';
import * as React from 'react';
import LockboxDetails from '../Common/LockboxDetails';
import Lockboxes from '../Common/Lockboxes';

const ManageSecrets: React.FC<PageComponentProps> = ({ piral }) => {

  const history = useHistory();

  const defaultLockbox = { application: '', name: '', environment: '', lockboxId: '', ownerContact: { eid: '', emailAddress: '' }, components: [] }

  const [selectedLockbox, setSelectedLockbox] = React.useState({
    value: defaultLockbox,
  });

  if (selectedLockbox == undefined) {
    setSelectedLockbox({
      value: defaultLockbox,
    })
  }

  const handleLockboxSelected = (lockbox) => {
    setSelectedLockbox(lockbox);
  }

  const handleAddPathsClick = (lockbox) => {
    history.push(`/secrets-mgmt/manage-secrets/secrets-manager/${[selectedLockbox.value.lockboxId]}`)
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, paddingBottom: '10px' }}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Manage Secrets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Here you can manage all of the secret paths within your Lockbox.  Start by selecting a lockbox to view its details, and then click the Add Secret Paths button!
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Lockboxes lockboxSelected={handleLockboxSelected} />
      <Box sx={{ flexGrow: 1, paddingBottom: '10px', visibility: (!!!selectedLockbox.value.name) ? 'hidden' : 'visible' }}>
        <Card>
          <CardContent>
            <LockboxDetails lockbox={selectedLockbox.value} />
          </CardContent>
          <CardActions>
            <Box
              display="flex"
              justifyContent="flex-end"
              width='100%'
            >
              <Button
                variant="outlined"
                startIcon={<DataObject />}
                onClick={handleAddPathsClick}>
                Add Secret Paths
              </Button>
            </Box>
          </CardActions>
        </Card>
      </Box>

    </>
  );
};

export default ManageSecrets;
