import { createFromIconfontCN } from '@ant-design/icons';

const __IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4809698_z83i6q5qa6s.js',
});

export default function IconFont({
  type,
  size = 'inherit',
}: {
  type: string;
  size?: number | string;
}) {
  return <__IconFont type={type} style={{ fontSize: size, color: '#333' }} />;
}
