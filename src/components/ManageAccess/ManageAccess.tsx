import { Box, Button, Card, CardActions, CardContent, Paper, styled, Typography } from '@mui/material';
import { PageComponentProps } from 'isz-app';
import * as React from 'react';
import { useHistory } from "react-router-dom";
import { EnhancedEncryption } from '@mui/icons-material';
import LockboxDetails from '../Common/LockboxDetails';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import Lockboxes from '../Common/Lockboxes';


const ManageAccess: React.FC<PageComponentProps> = ({ piral }) => {

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
  };

  const onHandleAddAccessClick = (event) => {
    history.push(`/secrets-mgmt/manage-access/access-manager/${[selectedLockbox.value.lockboxId]}`)
  };


  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#27272733' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <Box sx={{ flexGrow: 1, paddingBottom: '10px' }}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Manage Access
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ padding: '2px' }}>
              Here you can manage different types of access to your Lockbox secrets, which includes support for IAM, LDAP, AppRole, EC2, and Shared.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ padding: '2px' }}>
              Select a lockbox from the list below to get started.
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
                startIcon={<EnhancedEncryption />}
                onClick={onHandleAddAccessClick}>
                Add Lockbox Access
              </Button>
            </Box>
          </CardActions>
        </Card>
      </Box>
    </>
  );
};

export default ManageAccess;
