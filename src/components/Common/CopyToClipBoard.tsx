import styled from "@emotion/styled";
import Tooltip, { TooltipProps, tooltipClasses  } from "@mui/material/Tooltip";
import copy from "clipboard-copy";
import * as React from "react";

interface ChildProps {
  copy: (content: any) => void;
}

interface Props {
  TooltipProps?: Partial<TooltipProps>;
  children: (props: ChildProps) => React.ReactElement<any>;
}

interface OwnState {
  showTooltip: boolean;
  content: string;
}

const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
});

/**
 * Render prop component that wraps element in a Tooltip that shows "Copied to clipboard!" when the
 * copy function is invoked
 */
class CopyToClipboard extends React.Component<Props, OwnState> {
  public state: OwnState = { showTooltip: false, content: '' };

  public render() {
    return (
      <NoMaxWidthTooltip
        arrow
        open={this.state.showTooltip}
        placement="top"
        title={`Copied to Clipboard: ${this.state.content}`}
        leaveDelay={800}
        onClose={this.handleOnTooltipClose}
        {...this.props.TooltipProps || {}}
      >
        {this.props.children({ copy: this.onCopy }) as React.ReactElement<any>}
      </NoMaxWidthTooltip>
    );
  }

  private onCopy = (content: any) => {
    copy(content);
    this.setState({ showTooltip: true, content: content });
  };

  private handleOnTooltipClose = () => {
    this.setState({ showTooltip: false, content: '' });
  };
}

export default CopyToClipboard;
