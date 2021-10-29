import type { ComponentProps } from 'react';
import styled from 'styled-components';

export const MaskContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const Mask = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  :hover {
    opacity: 100;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
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
      <Mask {...maskProps}>
        <Toolbar {...toolbarProps} />
      </Mask>
    </MaskContainer>
  );
}
