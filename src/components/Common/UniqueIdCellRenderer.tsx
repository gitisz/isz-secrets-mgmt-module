import { ContentCopy } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import * as React from 'react';
import CopyToClipboard from './CopyToClipBoard';

export default (props) => {

  return (
    <>
      <CopyToClipboard>
        {({ copy }) => (
            <IconButton
              size='small'
              sx={{ paddingLeft: '0px' }}
              onClick={(e) => {
                e.preventDefault();
                e.cancelable = true;
                e.defaultPrevented = true;
                copy(props.value)}
              }
            >
              <ContentCopy fontSize="inherit" />
            </IconButton >
        )}
      </CopyToClipboard>
      <Tooltip
        arrow
        placement="top" title={props.value}>
        <span style={{ fontFamily: 'courier' }}>{props.value}</span>
      </Tooltip>
    </>
  )
};