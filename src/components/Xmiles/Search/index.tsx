import theme from '@/../config/theme';
import type { ReactElement } from 'react';
import React, { createElement, useRef, useState } from 'react';
import type { ColProps } from 'antd';
import { Button, Card, Col, Dropdown, Form, Input, Row, Space } from 'antd';
import type { FormInstance, FormProps } from 'antd/lib/form/Form';
import SearchForm from '@/components/SearchForm';
import valueTypeRegister from './valueTypeRegister';
import { DoubleRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { XmilesCol } from '../Col';
import SearchSelect from '@/components/SearchSelect';
import isValidValue from '@/utils/isValidValue';

const FormItem = Form.Item;
const { 'primary-color': primaryColor } = theme;

/**
 * WrapCard 容器
 * 固定左对齐
 */
const WrapCard = styled.div`
  .ant-dropdown {
    left: 0 !important;
  }
  .ant-form-item {
    margin-top: 6px;
    margin-bottom: 6px;
  }
`;

export const FormItemActive = styled(FormItem)<{ bordered?: boolean }>`
  border: ${({ bordered = true }) => (bordered ? '1px solid #e0e0e0' : 'none')};
  border-radius: 4px;
  transition: all 0.3s;

  &.ant-form-item-has-error {
    border-color: red;
    .ant-select:not(.ant-select-disabled):not(.ant-select-customize-input) .ant-select-selector {
      border-color: rgba(0, 0, 0, 0) !important;
    }

    & :not(.ant-input-disabled).ant-input:focus,
    & :not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper:focus,
    & :not(.ant-input-disabled).ant-input-focused,
    & :not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper-focused {
      box-shadow: unset;
    }
  }

  :focus-within,
  :hover {
    border-color: ${primaryColor};
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
  }

  .ant-form-item-explain,
  .ant-form-item-extra {
    position: absolute;
    top: 20%;
    right: 10%;
  }
`;

interface XmilesSearchProps {
  columns: XmilesCol[];
  formProps?: FormProps;
  colProps?: ColProps;
  btnExtr?: ReactElement[];
}

/**
 * 带浮窗的SearchForm
 */
export default ({ columns, formProps, colProps, btnExtr }: XmilesSearchProps) => {
  const hasCollapsed = [...columns]?.some((col) => col.isCollapsed);
  const [dropdownVis, setDropdownVis] = useState(false);
  const wrapCard = useRef<HTMLElement>(null);
  const [innerform] = Form.useForm(formProps?.form);

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
      <WrapCard ref={wrapCard as React.RefObject<HTMLDivElement>}>
        <SearchForm formProps={{ labelAlign: 'left', ...formProps, onFinish }}>
          <Row style={{ margin: 0 }} gutter={16}>
            {/**
             * 渲染逻辑
             * form实例内有值且属于隐藏项
             * 注入特定样式
             * */}

            <FormItem shouldUpdate={(pre, next) => pre !== next} noStyle>
              {({ getFieldValue }) =>
                [...columns]?.reduce((acc: JSX.Element[], cur, idx) => {
                  const { hideInSearch, dataIndex, isCollapsed, order, colSpan, colSize } = cur,
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

                  return hideInSearch || noValue
                    ? acc
                    : acc.concat(
                        cur?.renderItem?.(
                          {
                            ...cur,
                            formItemProps: { style, ...cur?.formItemProps },
                          },
                          colProp,
                        ) ?? (
                          <Col {...colProp}>
                            {renderItem(
                              {
                                ...cur,
                                formItemProps: { style, ...cur?.formItemProps },
                              },
                              innerform,
                            )}
                          </Col>
                        ),
                      );
                }, [])
              }
            </FormItem>

            {hasCollapsed && (
              <Col order={24} {...defaultCol}>
                <Dropdown
                  overlayStyle={{ width: '100%' }}
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
                        {[...columns]?.reduce((acc: JSX.Element[], cur, idx) => {
                          const { hideInSearch, dataIndex, isCollapsed, order, colSpan, colSize } =
                              cur,
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

                          return hideInSearch || !isCollapsed
                            ? acc
                            : acc.concat(
                                cur?.renderItem?.(cur, colProp) ?? (
                                  <Col {...colProp}>{renderItem(cur, innerform)}</Col>
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
                  <Button
                    htmlType="submit"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    查询
                  </Button>

                  <Button type="link" htmlType="reset">
                    重置
                  </Button>
                  {btnExtr ?? []}
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </SearchForm>
      </WrapCard>
    </Card>
  );
};

/**
 * 列渲染方式
 * @param col 列的配置项，兼容pro-table-col
 * @param form form实例，col内的renderFormItem需要此参数
 * @returns FormItem实例
 */
function renderItem(col: XmilesCol, form: FormInstance) {
  const { title, dataIndex, tooltip, formItemProps, renderFormItem, bordered } = col,
    Ele = renderCol(col),
    noStyle = Ele?.props?._just_placeholder;

  return (
    <FormItemActive
      label={title}
      name={dataIndex}
      tooltip={tooltip}
      bordered={bordered}
      noStyle={noStyle}
      {...formItemProps}
    >
      {renderFormItem?.(col as any, { type: 'form', defaultRender: () => Ele }, form) ?? Ele}
    </FormItemActive>
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
function renderCol(col: XmilesCol) {
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
