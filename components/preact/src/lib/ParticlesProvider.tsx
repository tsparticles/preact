import { createContext, h, VNode } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import type { Engine } from "@tsparticles/engine";

interface ParticlesContextValue {
  engine: Engine | undefined;
  isReady: boolean;
  error: Error | undefined;
}

const ParticlesContext = createContext<ParticlesContextValue | undefined>(
  undefined
);

interface ParticlesProviderProps {
  children: VNode;
  particlesInit?: (engine: Engine) => Promise<void> | void;
}

/**
 * ParticlesProvider: Preact component that wraps app with centralized
 * tsParticles engine initialization. Engine is loaded once and cached.
 */
export const ParticlesProvider = (props: ParticlesProviderProps) => {
  const [engine, setEngine] = useState<Engine | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      try {
        const { tsParticles } = await import("@tsparticles/engine");

        if (props.particlesInit) {
          await props.particlesInit(tsParticles);
        }

        if (mounted) {
          setEngine(tsParticles);
          setIsReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsReady(true);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [props.particlesInit]);

  const contextValue: ParticlesContextValue = {
    engine,
    isReady,
    error,
  };

  return h(
    ParticlesContext.Provider,
    { value: contextValue },
    props.children
  );
};

/**
 * useParticlesEngine: Hook to access the centralized engine from context.
 * Throws if called outside ParticlesProvider.
 */
export const useParticlesEngine = (): ParticlesContextValue => {
  const context = useContext(ParticlesContext);

  if (context === undefined) {
    throw new Error(
      "useParticlesEngine must be called within a ParticlesProvider"
    );
  }

  return context;
};
