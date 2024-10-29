import { Modal } from 'antd';
import React, { useEffect, useRef } from 'react';
import './index.less';

interface IProps {
  /** 标题 */
  title?: string;
  /** 显示状态 */
  open: boolean;
  /** 显示内容（富文本） */
  __html: string;
  /** 隐藏模型 */
  onCancel: () => void;
}

const PhoneModel: React.FC<IProps> = React.memo(
  ({ title = 'App Demos', open, onCancel, __html }) => {
    // - refs
    const phone = useRef<HTMLImageElement | null>(null);
    const content = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (content.current) {
        console.log(content.current.offsetWidth);
      }
    }, [content]);
    return (
      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        closable={false}
        wrapClassName="phone-model"
        width={300}
      >
        <div className="phone-model-content">
          <div
            className="phone-model-content__ct"
            dangerouslySetInnerHTML={{ __html }}
          />
          <img
            ref={phone}
            className="phone-model-content__phone"
            src={require('./images/phone.png')}
          />
          <div className="phone-model-content__nav">{title}</div>
        </div>
      </Modal>
    );
  },
);

export default PhoneModel;
