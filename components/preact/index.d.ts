// Type definitions for preact-particles
// Project: https://github.com/matteobruni/tsparticles
// Definitions by: Matteo Bruni <https://github.com/matteobruni>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import type { ComponentClass, JSX } from "preact";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";

export interface IParticlesProps {
    id?: string;
    width?: string;
    height?: string;
    options?: ISourceOptions;
    url?: string;
    params?: ISourceOptions;
    style?: JSX.CSSProperties;
    className?: string;
    canvasClassName?: string;
    container?: { current?: Container | undefined };
    particlesLoaded?: (container: Container) => Promise<void>;
}

export interface IParticlesState {
    library?: Container;
}

type Particles = ComponentClass<IParticlesProps, IParticlesState>;

declare const Particles: Particles;

declare function initParticlesEngine(cb: (engine: Engine) => Promise<void>): Promise<void>;

export default Particles;
export { Particles, initParticlesEngine };
