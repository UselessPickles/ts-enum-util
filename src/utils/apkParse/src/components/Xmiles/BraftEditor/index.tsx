import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import styled from 'styled-components';
import theme from '@/../config/theme';
const { 'primary-color': primaryColor } = theme;

const MyBraftEditor = styled(BraftEditor)`
  border-radius: 4px;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
  :focus-within,
  :hover {
    border-color: ${primaryColor};
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
  }
  & .public-DraftEditorPlaceholder-inner {
    color: #bfbfbf;
    font-size: 14px;
  }
  .ant-form-item-has-error & {
    border-color: #ff4d4f;
  }
`;
export default MyBraftEditor;
