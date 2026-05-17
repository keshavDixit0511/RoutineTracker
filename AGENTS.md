<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:rules -->
## Code style and structure

- Always format code in the idiomatic way for each language
- Always write concise, clear, and meaningful comments for functions, classes, and complex logic
- Always prefer writing readable code over writing clever or over-optimized code
- Always use descriptive variable and function names
- Always follow the existing codebase conventions for code style
- Do not include import paths that are not valid in the current project
- Never use `unsafe` code unless strictly required and explicitly permitted
- Do not use `any` type in TypeScript
- Prefer using `unknown` instead of `any` and validate data properly


## Testing

- Always write tests for the code you write
- Prefer integration tests over unit tests when appropriate
- Always write tests with clear and descriptive names
- Always ensure tests are self-contained and do not depend on external state


## Documentation

- Always write clear and concise documentation for the code you write
- Prefer writing docstrings over inline comments
- Always keep documentation up-to-date with code changes


## Debugging

- Always use print statements or debugging tools to understand code behavior
- Prefer using built-in debugging tools over print statements
- Always write clear and concise log messages
- Always include relevant context in log messages


## Error handling

- Always handle errors gracefully
- Prefer returning error objects over throwing exceptions
- Prefer using `Result<T, E>` types over throwing exceptions
- Prefer using `Result<T, E>` types over returning error objects
- Always validate data and handle potential errors gracefully
- Always provide meaningful error messages

<!-- END:rules -->
