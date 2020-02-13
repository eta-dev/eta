## Stuff

- Add `env` to `renderFile`
- Fix capitalization stuff
- Refactor types
- `renderFile` should use `options.filename`, `render` should use `options.name`.
- `{{~include()}}` should be a native helper compiling to `Env.include` or something similar
- One function that turns string, function, or partial config into an env
- Separate `includeFile` function
- Shortcut that would add `Render`, `Compile`, etc. to the config and call them. Ex. `Env.something.Render = Render(..., this)`
