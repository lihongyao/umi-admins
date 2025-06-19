// → 安装依赖：pnpm i  react-tsparticles tsparticles-engine tsparticles-slim

/**
 * 粒子效果
 * @See https://github.com/tsparticles/react
 *
 * 安装依赖：pnpm add @tsparticles/react @tsparticles/engine @tsparticles/slim
 */
import type { Container } from '@tsparticles/engine';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { memo, useEffect, useState } from 'react';
import './index.less';
import { particlesOptions } from './particlesOptions';

export default memo(function InitParticles() {
  const [init, setInit] = useState(false);
  const particlesLoaded = async (container?: Container) => {
    console.log(container);
  };
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return init ? (
    <Particles
      id="tsparticles"
      className={'tsparticles'}
      particlesLoaded={particlesLoaded}
      options={particlesOptions}
    />
  ) : null;
});
