import React, { Component } from "preact/compat";
import type { ComponentChild } from "preact";
import { tsParticles, Container } from "tsparticles-engine";
import type { IParticlesProps } from "./IParticlesProps";
import type { IParticlesState } from "./IParticlesState";
import { MutableRefObject } from "react";
import { deepCompare } from "./Utils";

/**
 * @param {IParticlesProps}
 */
export default class Particles extends Component<IParticlesProps, IParticlesState> {
    static defaultProps: IParticlesProps = {
        width: "100%",
        height: "100%",
        options: {},
        style: {},
        id: "tsparticles",
    };

    constructor(props: IParticlesProps) {
        super(props);

        this.state = {
            init: false,
            library: undefined,
        };
    }

    destroy(): void {
        if (!this.state.library) {
            return;
        }

        this.state.library.destroy();

        this.setState({
            library: undefined,
        });
    }

    shouldComponentUpdate(nextProps: Readonly<IParticlesProps>, nextState: Readonly<IParticlesState>): boolean {
        console.log(
            nextState.init !== this.state.init,
            nextProps.url !== this.props.url,
            nextProps.id !== this.props.id,
            nextProps.canvasClassName !== this.props.canvasClassName,
            nextProps.className !== this.props.className,
            nextProps.height !== this.props.height,
            nextProps.width !== this.props.width,
            !deepCompare(nextProps.style, this.props.style),
            nextProps.init !== this.props.init,
            nextProps.loaded !== this.props.loaded,
            !deepCompare(nextProps.options ?? nextProps.params, this.props.options ?? this.props.params, key =>
                key.startsWith("_"),
            ),
        );

        return (
            nextState.init !== this.state.init ||
            nextProps.url !== this.props.url ||
            nextProps.id !== this.props.id ||
            nextProps.canvasClassName !== this.props.canvasClassName ||
            nextProps.className !== this.props.className ||
            nextProps.height !== this.props.height ||
            nextProps.width !== this.props.width ||
            !deepCompare(nextProps.style, this.props.style) ||
            nextProps.init !== this.props.init ||
            nextProps.loaded !== this.props.loaded ||
            !deepCompare(nextProps.options ?? nextProps.params, this.props.options ?? this.props.params, key =>
                key.startsWith("_"),
            )
        );
    }

    componentDidUpdate(): void {
        this.refresh();
    }

    forceUpdate(): void {
        this.refresh().then(() => {
            super.forceUpdate();
        });
    }

    componentDidMount(): void {
        (async () => {
            if (this.props.init) {
                await this.props.init(tsParticles);
            }

            this.setState(
                {
                    init: true,
                },
                () => {
                    this.loadParticles();
                },
            );
        })();
    }

    componentWillUnmount(): void {
        this.destroy();
    }

    render(): ComponentChild {
        const { width, height, className, canvasClassName, id } = this.props;

        return (
            <div className={className} id={id}>
                <canvas
                    className={canvasClassName}
                    style={{
                        ...this.props.style,
                        width,
                        height,
                    }}
                />
            </div>
        );
    }

    private async refresh(): Promise<void> {
        this.destroy();

        await this.loadParticles();
    }

    private async loadParticles(): Promise<void> {
        if (!this.state.init) {
            return;
        }

        const cb = async (container?: Container) => {
            if (this.props.container) {
                (this.props.container as MutableRefObject<Container>).current = container;
            }

            this.setState({
                library: container,
            });

            if (this.props.loaded) {
                await this.props.loaded(container);
            }
        };

        const container = await (this.props.url
            ? tsParticles.loadJSON(this.props.id, this.props.url)
            : tsParticles.load(this.props.id, this.props.params ?? this.props.options));

        await cb(container);
    }
}
