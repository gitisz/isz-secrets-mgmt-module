import * as React from 'react';
import type { PiletApi } from 'isz-app';
import MenuItem from './components/MenuItem';
import './styles/index.scss';

const SecretsMgmt = React.lazy(() => import('./SecretsMgmt'));
const ManageAccess = React.lazy(() => import('./components/ManageAccess/ManageAccess'));
const AccessManager = React.lazy(() => import('./components/ManageAccess/AccessManager'));
const ManageSecrets = React.lazy(() => import('./components/ManageSecrets/ManageSecrets'));
const SecretsManager = React.lazy(() => import('./components/ManageSecrets/SecretsManager'));

export function setup(app: PiletApi) {

  app.registerPage('/secrets-mgmt', SecretsMgmt);
  app.registerPage('/secrets-mgmt/manage-access', ManageAccess);
  app.registerPage('/secrets-mgmt/manage-access/access-manager/:lockboxId', AccessManager);
  app.registerPage('/secrets-mgmt/manage-secrets', ManageSecrets);
  app.registerPage('/secrets-mgmt/manage-secrets/secrets-manager/:lockboxId', SecretsManager);
  app.registerMenu(() => <MenuItem piral={app} />);
  app.registerTile(() => <div>Lets manage some secrets!</div>, {
    initialColumns: 2,
    initialRows: 2,
  });
}





