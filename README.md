# Showmark Provider

## About

Context based components provider of "`react`" and "`preact`" for [Showdown.js](https://github.com/showdownjs/showdown) Markdown as MDX Component with [@types/mdx](https://www.npmjs.com/package/@types/mdx).

## Install

```bash
npm i showmark-provider
```

```bash
pnpm i showmark-provider
```

```bash
yarn add showmark-provider
```

## Use

```tsx
import { MarkdownProvider } from "showmark-provider/react";
import { MarkdownProvider } from "showmark-provider/preact";

const App = () => {
  return <MarkdownProvider>{/* children */}</MarkdownProvider>;
};
```

**_This project is for learning purposes only. It is not suitable for production use._**
