import type { Attributes, ComponentChildren, VNode } from 'preact';
import { createContext, h } from 'preact';
import { useContext } from 'preact/hooks';
import type { MarkdownComponents } from 'showmark-types';

type MergeComponents = (
  currentComponent: Readonly<MarkdownComponents>,
) => MarkdownComponents;

type Props = {
  children?: ComponentChildren;
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

//
const emptyComponents: Readonly<MarkdownComponents> = {};
const MarkdownContext = createContext(emptyComponents);

/**
 * Gets the current markdown components from the nearest provider.
 *
 * If given a value for `components`, it will be merged with the current
 * components. If `components` is a function, it will be called with the
 * current components as an argument and the return value will be used.
 *
 * @param components - Components to merge with the current components.
 * @returns The merged components.
 */
export function useMarkdownComponents(
  components?: AdditionalComponenrts,
): MarkdownComponents {
  const contextComponents = useContext(MarkdownContext);
  // Custom merge via a function prop
  if (typeof components === 'function') {
    return components(contextComponents);
  }

  return { ...contextComponents, ...components };
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
 * @returns A JSX element that provides the new components to its children.
 */
export function MarkdownProvider({
  components,
  children,
  disableParentContext = false,
}: Readonly<Props>): VNode<
  Attributes & {
    value: Readonly<MarkdownComponents>;
    children?: ComponentChildren;
  }
> {
  let allComponents: Readonly<MarkdownComponents>;
  if (disableParentContext) {
    allComponents =
      typeof components === 'function'
        ? components(emptyComponents)
        : components || emptyComponents;
  } else {
    allComponents = useMarkdownComponents(components);
  }
  return h(
    MarkdownContext.Provider,
    {
      children: undefined,
      value: allComponents,
    },
    children,
  );
}
