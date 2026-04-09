import type { JSX } from "preact";
import type { ISourceOptions, Container } from "@tsparticles/engine";

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
