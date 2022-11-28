import * as React from 'react';
import { Link } from 'react-router-dom';
import type { PiletApi } from 'isz-app';
import { ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { AppRegistration, Dns, MonitorHeart, Key } from '@mui/icons-material';

const SecretsMgmt = React.lazy(() => import('./SecretsMgmt'));

export function setup(app: PiletApi) {
  app.registerPage('/secrets-mgmt', SecretsMgmt);

  app.showNotification('Hello from Secrets Management!', {
    autoClose: 2000,
  });
  app.registerMenu(() =>
    <ListItemButton
      component={Link}
      to="/secrets-mgmt"
      sx={{
        minHeight: 48,
        justifyContent: open ? 'initial' : 'center',
        px: 2.5,
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: open ? 3 : 'auto',
          justifyContent: 'center',
        }}
        onClick={(event) => {
          <SecretsMgmt />
        }}
      >
        <Key />
      </ListItemIcon>
      <ListItemText primary="Secrets Mgmt" sx={{ opacity: open ? 1 : 0 }} />
    </ListItemButton>
  );
  app.registerTile(() => <div>Lets manage some secrets!</div>, {
    initialColumns: 2,
    initialRows: 2,
  });
}
