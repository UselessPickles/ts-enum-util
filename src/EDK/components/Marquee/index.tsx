import type { PropsWithChildren } from 'react';
import { useRef, useState } from 'react';

export interface Point {
  x: number;
  y: number;
}

export interface Diagonal {
  start: Point;
  end: Point;
}

export interface MarqueeProps {
  fill?: React.SVGProps<SVGPathElement>['fill'];
  opacity?: React.SVGProps<SVGPathElement>['opacity'];
  onRange?: (v: Diagonal) => void;
  sticky?: {
    offsetX?: number;
    offsetY?: number;
  };
}

export default function ({
  fill = 'lightgreen',
  opacity = 0.5,
  onRange,
  children,
  sticky,
}: PropsWithChildren<MarqueeProps>) {
  const [mask, setMask] = useState<{
    visibility?: 'visible' | 'hidden';
    left?: number;
    originLeft?: number;
    top?: number;
    originTop?: number;
    width?: number;
    height?: number;
  }>({});
  const num = (n?: string | number) => +(n ?? 0);
  const w = num(sticky?.offsetX),
    h = num(sticky?.offsetY);

  const ref = useRef<HTMLDivElement>(null);

  const calcX = (x: number) => x - num(ref.current?.getBoundingClientRect()?.left),
    calcY = (y: number) => y - num(ref.current?.getBoundingClientRect()?.top),
    stickyXCeil = (x: number) => (w ? Math.ceil(x / w) * w : x),
    stickyXFloor = (x: number) => (w ? Math.floor(x / w) * w : x),
    stickyYCeil = (y: number) => (h ? Math.ceil(y / h) * h : y),
    stickyYFloor = (y: number) => (h ? Math.floor(y / h) * h : y);

  const onMouseDown: React.DOMAttributes<HTMLDivElement>['onMouseDown'] = (e) => {
    const m = { ...mask };
    m.visibility = 'visible';
    m.left = calcX(e.clientX);
    m.originLeft = calcX(e.clientX);
    m.top = calcY(e.clientY);
    m.originTop = calcY(e.clientY);
    setMask(m);
  };

  const onMouseMove: React.DOMAttributes<HTMLDivElement>['onMouseMove'] = (e) => {
    if (mask?.visibility === 'visible') {
      setMask((pre) => {
        const isRight = calcX(e.clientX) - num(pre?.left) > 0,
          isDown = calcY(e.clientY) - num(pre?.top) > 0,
          nL = isRight ? stickyXFloor(num(pre.originLeft)) : stickyXCeil(num(pre.originLeft)),
          nT = isDown ? stickyYFloor(num(pre.originTop)) : stickyYCeil(num(pre.originTop)),
          nW =
            (isRight ? stickyXCeil(num(calcX(e.clientX))) : stickyXFloor(num(calcX(e.clientX)))) -
            num(pre?.left),
          nH =
            (isDown ? stickyYCeil(num(calcY(e.clientY))) : stickyYFloor(num(calcY(e.clientY)))) -
            num(pre?.top);

        return {
          ...pre,
          width: nW,
          height: nH,
          top: nT,
          left: nL,
        };
      });
    }
  };

  const onMouseUp: React.DOMAttributes<HTMLDivElement>['onMouseUp'] = () => {
    if (mask?.visibility === 'visible') {
      const start: Point = {
          x: num(mask?.width) > 0 ? num(mask?.left) : num(mask?.width) + num(mask?.left),
          y: num(mask?.height) > 0 ? num(mask?.top) : num(mask?.height) + num(mask?.top),
        },
        end: Point = {
          x: start.x + Math.abs(num(mask?.width)),
          y: start.y + Math.abs(num(mask?.height)),
        },
        vector: Diagonal = {
          start: {
            x: start.x + 1,
            y: start.y + 1,
          },
          end: {
            x: end.x - 1,
            y: end.y - 1,
          },
        };

      onRange?.(vector);

      setMask({ visibility: 'hidden' });
    }
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      ref={ref}
    >
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          left: 0,
          top: 0,
        }}
      >
        <path
          d={`M ${num(mask.left)} ${num(mask.top)}
          h ${num(mask.width)}
          v ${num(mask.height)}
          h ${-num(mask.width)}
          Z`}
          fill={fill}
          opacity={opacity}
        />
      </svg>
      {children}
    </div>
  );
}
