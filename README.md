# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

SETUP COMMANDS :

npm create astro@latest(install packages: Y ; create new project: ./new-project ; Start project: Empty; Install dependencies: Y ; Typescript: Y ; How Typescript should be: Strict; New Repo: Y;)

cd ./new-project && code .

npm start (to test)

npx astro add tailwind (Y to all)

Then, in astro.config.mjs, write
integrations: [tailwind({
applyBaseStyles: false,
})]

Then,
create src/styles/global.css and add theses lines :
@tailwind base;
@tailwind components;
@tailwind utilities;

Then, in index.astro, in code fences, import de global.css :
import '../styles/global.css';

npm i @wp-block-tools/styles

Then, in tailwind.config.mjs, add this line :
content: [
'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
--> './node_modules/@wp-block-tools/styles/**/*.js' <--
],

npm i -D prettier prettier-plugin-astro
Then, create src/.prettierrc.mjs file
Then add the plugin to your Prettier configuration:
// .prettierrc.mjs
/\*_ @type {import("prettier").Config} _/
export default {
plugins: ['prettier-plugin-astro'],
overrides: [
{
files: '*.astro',
options: {
parser: 'astro',
},
},
],
};

Then close VSCode (if opened) and reopen it
