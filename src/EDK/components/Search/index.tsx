import type { ReactElement, ReactNode, RefObject } from 'react';
import { createElement, useRef, useState } from 'react';
import type { ColProps } from 'antd';
import { Button, Card, Col, Dropdown, Form, Input, Row, Space } from 'antd';
import type { FormItemProps, TableColumnProps } from 'antd';
import type { FormInstance, FormProps } from 'antd/lib/form/Form';
import SearchForm from '../../components/SearchForm';
import valueTypeRegister from './valueTypeRegister';
import { DoubleRightOutlined } from '@ant-design/icons';
import SearchSelect from '../SearchSelect';
import isValidValue from '../../utils/isValidValue';
import type { ValueEnum, ValueType } from '../type';
import styles from './index.less';
import useResize from '../../hooks/useResize';

const FormItem = Form.Item;

export interface SearchColumnsProps<RecordType> {
  isCollapsed?: boolean;
  bordered?: boolean;
  colSize?: number;
  dataIndex?: TableColumnProps<RecordType>['dataIndex'];
  title?: TableColumnProps<RecordType>['title'];
  order?: number;
  colSpan?: number;
  renderItem?: (col: SearchColumnsProps<RecordType>, colProps: ColProps) => ReactElement;
  formItemProps?: FormItemProps;
  valueType?: ValueType;
  tooltip?: FormItemProps['tooltip'];
  renderFormItem?: (
    c: SearchColumnsProps<RecordType>,
    defaultRender: ReactNode,
    form: FormInstance,
  ) => ReactNode;
  valueEnum?: ValueEnum;
  hideInSearch?: boolean;
  fieldProps?: any;
}

interface XmilesSearchProps<RecordType> {
  columns?: SearchColumnsProps<RecordType>[];
  formProps?: FormProps;
  colProps?: ColProps;
  btnExtra?: ReactElement[];
  addonAfter?: (form: FormProps['form']) => ReactNode;
  addonBefore?: (form: FormProps['form']) => ReactNode;
}

/**
 * 带浮窗的SearchForm
 */
export default <RecordType extends Record<any, any> = any>({
  columns,
  formProps,
  colProps,
  addonBefore,
  addonAfter,
  btnExtra: btnExtra,
}: XmilesSearchProps<RecordType>) => {
  const hasCollapsed = columns?.some((col) => col.isCollapsed);
  const [dropdownVis, setDropdownVis] = useState(false);
  const wrapCard = useRef<HTMLElement>(null);
  const [innerForm] = Form.useForm(formProps?.form);
  const rect = useResize(wrapCard);

  const defaultCol = colProps || {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 8,
    xxl: 6,
  };

  function dropdownVisHandler() {
    setDropdownVis((pre) => !pre);
  }

  function closeDropdown(vis: boolean) {
    if (vis === false) {
      setDropdownVis(false);
    }
  }

  function onFinish(value: any) {
    formProps?.onFinish?.(value);
    setDropdownVis(false);
  }

  function getContainer() {
    return wrapCard?.current as HTMLElement;
  }

  return (
    <Card style={{ borderRadius: '4px' }} bodyStyle={{ padding: '12px' }}>
      {addonBefore?.(innerForm)}
      <div ref={wrapCard as RefObject<HTMLDivElement>} className={styles.wrap}>
        <SearchForm formProps={{ labelAlign: 'left', ...formProps, onFinish }}>
          <Row style={{ margin: 0 }} gutter={16}>
            {/**
             * 渲染逻辑
             * form实例内有值且属于隐藏项
             * 注入特定样式
             * */}

            <FormItem shouldUpdate={(pre, next) => pre !== next} noStyle>
              {({ getFieldValue }) =>
                columns?.reduce((acc: JSX.Element[], cur, idx) => {
                  const { isCollapsed, order, colSpan, colSize, hideInSearch } = cur,
                    dataIndex = cur?.dataIndex as FormItemProps['name'],
                    validValue = isValidValue(dataIndex && getFieldValue?.(dataIndex)),
                    noValue = isCollapsed && !validValue,
                    style = isCollapsed ? { background: '#E8EAEC' } : {},
                    // 倍数 兼容 新旧api
                    mulSpan = colSpan || colSize || 1;
                  const mulColProp: any = { ...defaultCol };
                  if (mulSpan !== 1) {
                    for (const k in mulColProp) {
                      if (typeof mulColProp?.[k] === 'number') {
                        const calc = mulColProp?.[k] * mulSpan;
                        mulColProp[k] = calc > 24 ? 24 : calc;
                      }
                    }
                  }

                  const colProp = {
                    order: order || 24,
                    key: dataIndex ? dataIndex.toString() : idx,
                    ...mulColProp,
                  };

                  const formItemProps: FormItemProps = {
                    style,
                    hidden: hideInSearch,
                    ...cur?.formItemProps,
                  };

                  return noValue || hideInSearch
                    ? acc
                    : acc.concat(
                        cur?.renderItem?.({ ...cur, formItemProps }, colProp) ?? (
                          <Col {...colProp}>{renderItem({ ...cur, formItemProps }, innerForm)}</Col>
                        ),
                      );
                }, [])
              }
            </FormItem>

            {hasCollapsed && (
              <Col order={24} {...defaultCol}>
                <Dropdown
                  overlayStyle={{
                    width: '100%',
                    top: (rect?.height ?? 0) + 24,
                  }}
                  getPopupContainer={getContainer}
                  visible={dropdownVis}
                  placement="bottomRight"
                  trigger={['click']}
                  onVisibleChange={closeDropdown}
                  overlay={
                    <Card
                      style={{
                        width: '100%',
                        background: '#fff',
                        padding: '16px 12px',
                      }}
                    >
                      <Row style={{ margin: 0 }} gutter={16}>
                        {/**
                         * 渲染逻辑类似上面，但是只渲染隐藏项
                         */}
                        {columns?.reduce((acc: JSX.Element[], cur, idx) => {
                          const {
                              dataIndex,
                              isCollapsed,
                              order,
                              colSpan,
                              colSize,
                              hideInSearch,
                            } = cur,
                            // 倍数 兼容 新旧api
                            mulSpan = colSpan || colSize || 1;
                          const mulColProp: any = { ...defaultCol };
                          if (mulSpan !== 1) {
                            for (const k in mulColProp) {
                              if (typeof mulColProp[k] === 'number') {
                                const calc = mulColProp?.[k] * mulSpan;
                                mulColProp[k] = calc > 24 ? 24 : calc;
                              }
                            }
                          }

                          const colProp = {
                            order: order || 24,
                            key: dataIndex ? dataIndex.toString() : idx,
                            ...mulColProp,
                          };

                          return !isCollapsed || hideInSearch
                            ? acc
                            : acc.concat(
                                cur?.renderItem?.(cur, colProp) ?? (
                                  <Col {...colProp}>{renderItem(cur, innerForm)}</Col>
                                ),
                              );
                        }, [])}
                      </Row>
                    </Card>
                  }
                >
                  <FormItem>
                    <Button onClick={dropdownVisHandler}>
                      更多筛选
                      <DoubleRightOutlined
                        style={{ color: '#999' }}
                        rotate={dropdownVis ? 90 + 180 : 90}
                      />
                    </Button>
                  </FormItem>
                </Dropdown>
              </Col>
            )}

            <Col order={24} flex={'auto'}>
              <Form.Item style={{ float: 'right' }}>
                <Space>
                  <Button htmlType="submit" type="primary" ghost>
                    查询
                  </Button>

                  <Button type="link" htmlType="reset">
                    重置
                  </Button>
                  {btnExtra ?? []}
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </SearchForm>
      </div>
      {addonAfter?.(innerForm)}
    </Card>
  );
};

/**
 * 列渲染方式
 * @param col 列的配置项，兼容pro-table-col
 * @param form form实例，col内的renderFormItem需要此参数
 * @returns FormItem实例
 */
function renderItem<RecordType>(col: SearchColumnsProps<RecordType>, form: FormInstance) {
  const { title, tooltip, formItemProps, renderFormItem, bordered = true, hideInSearch } = col,
    dataIndex = col.dataIndex as FormItemProps['name'],
    Ele = renderCol(col),
    noStyle = Ele?.props?._just_placeholder;

  return (
    <FormItem
      hidden={hideInSearch}
      label={title}
      name={dataIndex}
      tooltip={tooltip}
      className={` ${bordered ? styles['form-item-active-border'] : styles['form-item-active']}`}
      noStyle={noStyle}
      {...formItemProps}
    >
      {renderFormItem?.(col as any, { type: 'form', defaultRender: () => Ele }, form) ?? Ele}
    </FormItem>
  );
}

/**
 *
 * @param valueEnum 兼容pro-table的value枚举，支持Record和Map
 * @returns entries 数组[[k1, v1], [k2, v2]]
 */
export function getValueEnum(valueEnum: Map<any, any> | Record<any, any> | undefined) {
  if (valueEnum instanceof Map) {
    return valueEnum?.entries();
  } else if (typeof valueEnum === 'object') {
    return Object?.entries(valueEnum);
  }

  console.warn('invalid valueEnum ', valueEnum);
  return [];
}

// 解析valueType 生成具体元素
function renderCol<RecordType>(col: SearchColumnsProps<RecordType>) {
  const { valueEnum, valueType, fieldProps } = col;
  let Comp,
    defaultProps,
    options: any[] = [];
  if (valueEnum !== undefined) {
    for (const [k, v] of getValueEnum(valueEnum)) {
      options = [
        ...options,
        {
          /**
           * 要支持 { 'Sigmob', { text: 'Sigmob'} } 结构
           */
          label: v?.text || v,
          value: k,
        },
      ];
    }
  }

  if (typeof valueType === 'string') {
    [Comp, defaultProps] = valueTypeRegister[valueType];
  } else if (valueType === undefined && valueEnum !== undefined) {
    Comp = SearchSelect;
    defaultProps = { placeholder: '请选择' };
  } else {
    Comp = Input;
    defaultProps = { placeholder: '请输入' };
  }

  return createElement(Comp, {
    ...defaultProps,
    options,
    ...fieldProps,
    bordered: false,
    allowClear: true,
  });
}
