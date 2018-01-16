# javascript-project-boilerplate

## An opinionated, extremely-bare-bones JavaScript project template.

## Why did you make this?

Mostly to save myself time. With this boilerplate, I can create a starting point for JS projects very quickly, and not have to worry about transpilation, using `import/export` in Node environments, etc.

## How do I use it?

1. Do `yarn global add javascript-project-boilerplate`
2. Go to the dir in which you'd like to init a new project
3. Do `javascript-project-boilerplate`

Once installed, you can run `start` to run the project from the entry point (`index.js`), `build` to transpile the `src` directory to a `dist` directory, or `lint`.

## Notes

**Requires Node >=9**

You can use this in a non-empty git repository, if you'd like. This allows you to clone an empty repo, do your `yarn init` to create a basic `package.json` with your author/repo details, and _then_ do `javascript-project-boilerplate`. The boilerplate's `package.json` will be merged with your pre-existing `package.json` (giving preference to the existing file).
