import React, { memo, useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };
type Position = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export default memo(function DragView({
  children,
  position = { right: 15, bottom: 80 },
  onPress,
}: {
  /** 拖拽元素 */ children: JSX.Element | JSX.Element[];
  /** 拖拽元素初始位置 */
  position?: Position;
  /** 点击事件 */
  onPress: () => void;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const isTrigger = useRef(false);
  const timer = useRef<NodeJS.Timeout>();

  const [offset, setOffset] = useState<Point>(() => ({ x: 0, y: 0 }));

  const dragging = (event: MouseEvent | TouchEvent) => {
    // -- 阻止事件冒泡
    event.stopPropagation();
    // -- 异常处理
    if (!isTrigger.current || !container.current) return;
    // -- 获取当前移动的位置
    const { width, height } = container.current.getBoundingClientRect();

    // -- 计算可移动的最大距离
    const maxOffsetX = window.innerWidth - width;
    const maxOffsetY = window.innerHeight - height;

    // -- 获取鼠标当前位置
    const x = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const y = 'clientY' in event ? event.clientY : event.touches[0].clientY;

    // -- 位移距离
    let offsetX = x - width / 2;
    let offsetY = y - height / 2;

    // -- 判断边界
    if (offsetX < 0) {
      offsetX = 0;
    } else if (offsetX > maxOffsetX) {
      offsetX = maxOffsetX;
    }
    if (offsetY < 0) {
      offsetY = 0;
    } else if (offsetY > maxOffsetY) {
      offsetY = maxOffsetY;
    }
    // -- 更新位置
    setOffset({ x: offsetX, y: offsetY });
  };
  const dragEnd = (event: MouseEvent | TouchEvent) => {
    // -- 阻止事件冒泡
    event.stopPropagation();
    // -- 移除
    clearTimeout(timer.current);
    // -- 判断是否激活点击事件
    if (isTrigger.current) {
      // -- 更新状态
      isTrigger.current = false;
      // -- 允许交互
      document.body.style.overflow = 'auto';
    } else {
      onPress();
    }
    // -- 移除事件
    document.removeEventListener('mousemove', dragging);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchmove', dragging);
    document.removeEventListener('touchend', dragEnd);
  };

  const dragStart = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    // -- 阻止事件冒泡
    event.stopPropagation();
    // -- 长按激活拖拽状态
    timer.current = setTimeout(() => {
      // -- 激活拖拽状态
      isTrigger.current = true;
      // -- 禁止交互
      document.body.style.overflow = 'hidden';
    }, 250);
    // -- 事件监听
    document.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchmove', dragging);
    document.addEventListener('touchend', dragEnd);
  };

  // methods
  const setInitialPosition = () => {
    if (!container.current) return;

    // -- 获取容器元素的尺寸信息
    const { width: containerW, height: containerH } =
      container.current.getBoundingClientRect();
    // -- 获取用户设置的位置信息
    const { top, right, bottom, left } = position;

    // 定义_pos记录临时坐标，默认在右下侧
    let offsetX = 0;
    let offsetY = 0;

    // -- 单独判断并设置各方向的值
    if (top !== undefined) {
      offsetY = top;
    }
    if (right !== undefined) {
      offsetX = window.innerWidth - right - containerW;
    }
    if (bottom !== undefined) {
      offsetY = window.innerHeight - bottom - containerH;
    }
    if (left !== undefined) {
      offsetX = left;
    }

    // -- 同一方向，如果同时设置top、bottom值，则bottom值有效；
    if (top !== undefined && bottom !== undefined) {
      offsetY = window.innerHeight - bottom - containerH;
    }

    // -- 同一方向，如果同时设置left、right值，则right值有效；
    if (left !== undefined && right !== undefined) {
      offsetX = window.innerWidth - right - containerW;
    }

    // -- 更新拖拽元素位置
    setOffset({ x: offsetX, y: offsetY });
  };

  useEffect(() => {
    setInitialPosition();
  }, [container]);

  useEffect(() => {
    const onResize = () => setInitialPosition();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // render
  return (
    <div
      ref={container}
      className="lg-drag-view"
      style={{
        position: 'fixed',
        zIndex: 1,
        left: offset.x + 'px',
        top: offset.y + 'px',
      }}
      onMouseDown={dragStart}
      onTouchStart={dragStart}
    >
      {children}
    </div>
  );
});
