import { cloneElement, useReducer } from 'react';
import useDebounce from '../../hooks/useDebounce';
import useThrottle from '../../hooks/useThrottle';
import type { Select } from 'antd';
import { Empty, Spin } from 'antd';

import type { useQuery } from 'react-query';

import { curry } from '../utils';

export type LIMIT_TYPE = 'debounce' | 'throttle';

export interface SearchAsyncParam {
  delay?: number;
  limitType?: LIMIT_TYPE;
  query: (value: any) => ReturnType<typeof useQuery>;
  reducer?: () => ReturnType<typeof useReducer>;
  trigger?: string[];
}

export const DefaultReducer = () =>
  useReducer((state: any, action: any) => {
    switch (action.type) {
      case 'onSearch':
        return action.payload[0];
      case 'onDeselect':
        return ' ';
      default:
        return state;
    }
  }, '');
/**
 * api搜索切片
 */

export default curry(
  (
    {
      delay = 800,
      limitType = 'throttle',
      query,
      reducer = DefaultReducer,
      trigger = ['onSearch', 'onDeselect'],
    }: SearchAsyncParam,
    Element: ReturnType<typeof Select>,
  ) => {
    const [state, dispatch] = reducer();
    const { data: options, isLoading: loading } = query(state);

    function useDispatch(event: any) {
      const fn = (...args: any) => {
        dispatch?.({ type: event, payload: args });
        Element?.props?.[event]?.(...args);
      };
      return {
        debounce: useDebounce(fn, delay),
        throttle: useThrottle(fn, delay),
      }[limitType];
    }

    return cloneElement(Element, {
      showSearch: true,
      filterOption: false,
      notFoundContent: loading ? <Spin style={{ width: '100%' }} tip="loading..." /> : <Empty />,
      options,
      loading,
      ...trigger?.reduce(
        (acc, event) => ({
          ...acc,
          [event]: useDispatch(event),
        }),
        {},
      ),
    });
  },
);
