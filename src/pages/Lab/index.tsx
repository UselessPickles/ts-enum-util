import { useRef } from 'react';
import { Upload } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import Mask from '@/components/Mask';

export default () => {
  const ref = useRef<HTMLVideoElement>(null);

  const children = (
    <EyeOutlined
      style={{ fontSize: '2.5em', filter: 'invert(100%)' }}
      onClick={(e) => e.stopPropagation()}
    />
  );
  return (
    <div>
      <Upload>
        <Mask toolbarProps={{ children }}>
          <video preload="metadata" width={600} ref={ref}>
            <source
              src="https://game-566.oss-cn-shanghai.aliyuncs.com/head/1635151946678.mp4"
              type="video/mp4"
            />
            lab
          </video>
          <button
            onClick={() => {
              if (ref?.current?.paused || ref?.current?.ended) {
                ref?.current?.play();
              } else {
                ref?.current?.pause();
              }
            }}
          >
            {ref?.current?.paused || ref?.current?.ended ? 'play' : 'pause'}
          </button>
        </Mask>
      </Upload>
    </div>
  );
  // poster="https://game-566.oss-cn-shanghai.aliyuncs.com///rc-upload-1635473398413-35-20210428183351_896_161960603189615.png"
};
