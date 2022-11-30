import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { PageComponentProps } from 'isz-app';
import * as React from 'react';

const SecretsMgmt: React.FC<PageComponentProps> = ({ piral }) => {

  const showNotification = () => {
    piral.showNotification(
      `This is a notification...`, { title: "Secrets Mgmt Notification", type: 'warning', autoClose: 10000 }
    )
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Secrets Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Let us manage some secrets!
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={showNotification}
            size="small">Notify</Button>
        </CardActions>
      </Card>
    </>
  );
};

export default SecretsMgmt;
