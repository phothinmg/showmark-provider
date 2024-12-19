import React, { type ReactElement, type ReactNode } from 'react';
import type { MarkdownComponents } from 'showmark-types';

type MergeComponents = (
  currentComponent: Readonly<MarkdownComponents>,
) => MarkdownComponents;

type Props = {
  children?: ReactNode | null | undefined;
  components?:
    | Readonly<MarkdownComponents>
    | MergeComponents
    | null
    | undefined;
  disableParentContext?: boolean | null | undefined;
};
type AdditionalComponenrts =
  | Readonly<MarkdownComponents>
  | MergeComponents
  | null
  | undefined;
const emptyComponents: Readonly<MarkdownComponents> = {};

const MarkdownContext = React.createContext(emptyComponents);


/**
 * Retrieves the current markdown components from the nearest context provider.
 *
 * Optionally accepts a `components` parameter to merge with the current
 * components. If `components` is a function, it will be invoked with the
 * current components as an argument, and its return value will be used.
 *
 * @param components - Components to merge with the current components.
 * @returns The merged components as a memoized result.
 */

export function useMarkdownComponents(components?: AdditionalComponenrts) {
  const contextComponents = React.useContext(MarkdownContext);
  return React.useMemo(() => {
    if (typeof components === 'function') {
      return components(contextComponents);
    }
    return { ...contextComponents, ...components };
  }, [contextComponents, components]);
}

/**
 * Provides markdown components to descendants.
 *
 * If `disableParentContext` is true, the given `components` will be used
 * directly, without merging with the current context. If `components` is a
 * function, it will be called with the current components as an argument and
 * the return value will be used.
 *
 * @param components - Components to merge with the current components.
 * @param children - The children to render with the new components.
 * @param disableParentContext - If true, the given `components` will be used
 *   directly, without merging with the current context.
 * @returns A JSX element that provides the new components to its children.
 */
export function MarkdownProvider({
  components,
  children,
  disableParentContext = false,
}: Readonly<Props>): ReactElement {
  let allComponents: Readonly<MarkdownComponents>;
  if (disableParentContext) {
    allComponents =
      typeof components === 'function'
        ? components(emptyComponents)
        : components || emptyComponents;
  } else {
    allComponents = useMarkdownComponents(components);
  }
  return React.createElement(
    MarkdownContext.Provider,
    { value: allComponents },
    children,
  );
}
