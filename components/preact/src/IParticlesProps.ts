import type { CSSProperties, RefObject } from "react";
import type { ISourceOptions, Container, Engine } from "tsparticles-engine";

export interface IParticlesProps {
    id?: string;
    width?: string;
    height?: string;
    options?: ISourceOptions;
    url?: string;
    params?: ISourceOptions;
    style?: CSSProperties;
    className?: string;
    canvasClassName?: string;
    container?: RefObject<Container>;
    init?: (engine: Engine) => Promise<void>;
    loaded?: (container: Container) => Promise<void>;
}
