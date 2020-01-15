## Ideas

- Should we put `;` after `exec` commands?
- Switch to `=` for interpolate syntax?
- Parameter (`l`?) that's function to load a storage key. Ex. `l('h','hi')` instead of `Sqrl.H.get("hi")`
- Get rid of `Sqrl.Partials`, `Sqrl.Layouts`. Load them all into one storage
- Use one of these RegExps (use the first unless it somehow breaks) to capture groups while looping through powerchars.:

```
(?:[^]*?|(?:'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'|`(?:\\[\s\w"'\\`]|[^\\`])*?`|"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"))*?(?:([|()]|=>)|\/\*[^]*?\*\/|((\/)?(-|_)?}}))

(?:(?:'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'|`(?:\\[\s\w"'\\`]|[^\\`])*?`|"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?")|\/\*[^]*?\*\/|[^])*?(?:([|()]|=>)|((\/)?(-|_)?}}))
```
