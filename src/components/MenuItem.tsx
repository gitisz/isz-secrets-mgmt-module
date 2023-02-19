import { ExpandLess, ExpandMore, Key, EnhancedEncryption, DataObject } from "@mui/icons-material";
import { ListItemButton, ListItemText, ListItemIcon, useTheme, Collapse, List, Tooltip } from '@mui/material';
import { Link, matchPath } from 'react-router-dom';
import { MenuComponentProps, PiralStoreDataEvent } from "isz-app";
import * as React from "react";

const MenuItem: React.FC<MenuComponentProps> = ({ piral }) => {


  const navigation = piral.getNavigation();

  const theme = useTheme();

  function useSecretsMgmtState(name: string) {

    const [secretsMgmt, setSecretsMgmt] = React.useState({
      menuColor: !!matchPath(location.pathname, `/${name}`) ? theme.palette.primary.light : 'transparent',
      expanded: false,
    });

    React.useEffect(() => {
      const handler = (ev: PiralStoreDataEvent) => {
        if (ev.name == name) {
          setSecretsMgmt(ev.value);
        } else {
          setSecretsMgmt(
            {
              menuColor: "transparent",
              expanded: false,
            });
        }
      };

      piral.on('store-data', handler);

      return () => {
        piral.off('store-data', handler);
      };
    }, [name]);

    return secretsMgmt;
  }

  const secretsMgmtState = useSecretsMgmtState("secrets-mgmt");

  const handleClick = () => {
    console.log(navigation.drawer);
    if (navigation.drawer == 'open') {
      piral.setData("secrets-mgmt", {
        ...secretsMgmtState,
        menuColor: theme.palette.primary.light,
        expanded: !secretsMgmtState.expanded
      });
    } else {
      piral.setNavigation({
        name: 'secrets-mgmt',
        navigation: '/secrets-mgmt',
        drawer: 'open'
      });
    }
  };

  return (
    <>
      <ListItemButton
        key="secrets-mgmt"
        component={Link}
        to="/secrets-mgmt"
        onClick={handleClick}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          ":before": {
            position: 'absolute',
            content: '""',
            left: 0,
            top: 0,
            height: '100%',
            width: '4px',
            background: secretsMgmtState.menuColor
          }
        }}
      >
        {navigation.drawer == 'open' &&
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <Key />
          </ListItemIcon>
        }
        {navigation.drawer == 'closed' &&
          <Tooltip title="Secrets Mgmt" placement="right" >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <Key />
            </ListItemIcon>
          </Tooltip>
        }
        <ListItemText primary="Secrets Mgmt" sx={{ opacity: open ? 1 : 0 }} />
        {secretsMgmtState.expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={secretsMgmtState.expanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            component={Link}
            to="/secrets-mgmt/manage-access"
            sx={{ pl: 4 }}>
            <ListItemIcon>
              <EnhancedEncryption />
            </ListItemIcon>
            <ListItemText primary="Manage Access" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/secrets-mgmt/manage-secrets"
            sx={{ pl: 4 }}>
            <ListItemIcon>
              <DataObject />
            </ListItemIcon>
            <ListItemText primary="Manage Secrets" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  )
}

export default MenuItem;
