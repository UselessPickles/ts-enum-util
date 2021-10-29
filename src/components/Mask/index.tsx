import type { ComponentProps } from 'react';
import styled from 'styled-components';

export const MaskContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 8px;
  :hover {
    .mask-tool {
      opacity: 1;
    }
  }
`;

export const Mask = styled.span`
  position: absolute;
  z-index: 1;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: all 0.3s;
  transform: translate(-100%);
  :hover {
    .mask-tool-bar {
      opacity: 1;
    }
  }
`;

export const Toolbar = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  white-space: nowrap;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: all 0.3s;
  .anticon {
    opacity: 0.85;
    :hover {
      opacity: 1;
    }
  }
`;

import type { PropsWithChildren } from 'react';

export interface MaskProps {
  maskProps?: ComponentProps<typeof Mask>;
  containerProps?: ComponentProps<typeof MaskContainer>;
  toolbarProps?: ComponentProps<typeof Toolbar>;
}

export default function ({
  children,
  maskProps,
  containerProps,
  toolbarProps,
}: PropsWithChildren<MaskProps>) {
  return (
    <MaskContainer {...containerProps}>
      {children}
      <Mask {...maskProps} className="mask-tool">
        <Toolbar {...toolbarProps} className="mask-tool-bar" />
      </Mask>
    </MaskContainer>
  );
}
