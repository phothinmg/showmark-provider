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

// get current component
export function useMarkdownComponents(components?: AdditionalComponenrts) {
  const contextComponents = React.useContext(MarkdownContext);
  return React.useMemo(() => {
    if (typeof components === 'function') {
      return components(contextComponents);
    }
    return { ...contextComponents, ...components };
  }, [contextComponents, components]);
}

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
