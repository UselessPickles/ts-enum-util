import React from 'react';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import type { RefSelectProps } from 'antd/lib/select';
import Search from '../../decorators/Select/Search';
import { compose } from '../../decorators/utils';

export default (
  props: JSX.IntrinsicAttributes &
    SelectProps<any> & { ref?: React.Ref<RefSelectProps> | undefined },
) => compose(Search)(<Select placeholder="请选择" {...props} />);
