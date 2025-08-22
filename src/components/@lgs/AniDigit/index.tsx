import { animated, useSpring } from '@react-spring/web';
import { memo, useEffect } from 'react';

export default memo(function AniDigit({
  value = 0,
  precision = 2,
  className,
}: {
  className?: string;
  value?: number;
  precision?: number;
}) {
  const [props, api] = useSpring(() => ({
    from: { num: 0 },
    config: {
      mass: 1,
      tension: 200,
      friction: 20,
      duration: 500,
    },
  }));

  useEffect(() => {
    api.start({ num: value });
  }, [value, api]);

  return (
    <animated.span className={className}>
      {props.num.to((n) => n.toFixed(precision))}
    </animated.span>
  );
});
