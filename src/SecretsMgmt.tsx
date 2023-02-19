import { EnhancedEncryption, DataObject, VerifiedUser } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, styled, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { PageComponentProps } from 'isz-app';
import { Link } from 'react-router-dom';
import * as React from 'react';

const SecretsMgmt: React.FC<PageComponentProps> = ({ piral }) => {

  const showNotification = () => {
    piral.showNotification(
      `This is a notification...`, { title: "Secrets Mgmt Notification", type: 'success', autoClose: 10000 }
    )
  };

  const Item = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#27272733' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));

  const lockboxCount = 7;

  return (
    <>

      <Box sx={{ flexGrow: 1, paddingBottom: '10px' }}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Secrets Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Let's manage some secrets!
            </Typography>
            <Box sx={{ paddingTop: '10px' }}>
              <VerifiedUser fontSize="small" sx={{ verticalAlign: 'text-bottom' }} />
              <span style={{ paddingLeft: '5px' }}>
                Access is being managed by the <Button sx={{ padding: '4px 2px 2px 2px' }}>GOT-HORIZONTAL</Button> app, which can connect with <Button sx={{ padding: '0px 2px 2px 2px', width: '20px', minWidth: '20px' }}>[{lockboxCount}]</Button> Lockboxes.
              </span>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ padding: '0px' }}>
          <Grid xs={2} sm={4} md={6}>
            <Item key={"manage-access"} sx={{ padding: '0px' }}>
              <Card>
                <CardContent
                  sx={{
                    height: '200px'
                  }}>
                  <Typography gutterBottom variant="h5" component="div">
                    Manage Access
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You can manage different types of access to your Lockbox secrets, which includes support for IAM, LDAP, AppRole, EC2, and Shared.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Box
                    m={1}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    width='100%'
                  >
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/secrets-mgmt/manage-access"
                      startIcon={<EnhancedEncryption />}
                    >
                      Manage Accesss
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Item>
          </Grid>
          <Grid xs={2} sm={4} md={6}>
            <Item sx={{ padding: '0px' }}>
              <Card>
                <CardContent
                  sx={{
                    height: '200px'
                  }}>
                  <Typography gutterBottom variant="h5" component="div">
                    Manage Secrets
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Once you have access setup for your lockbox, you can add the secret paths and even the secrets themselves!
                  </Typography>
                </CardContent>
                <CardActions>
                  <Box
                    m={1}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    width='100%'
                  >
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/secrets-mgmt/manage-secrets"
                      startIcon={<DataObject />}
                    >
                      Manage Secrets
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SecretsMgmt;
