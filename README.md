# @devmy/dotenv2shell - Load Environment Variables from .env File

This TypeScript CLI lets you easily load environment variables from a `.env` file into your current shell session with [@dotenv-run/core](https://www.npmjs.com/package/@dotenv-run/core). It provides flexibility through various options and supports both zsh and bash.

- ✅ Load environment variables from .env files
- ✅ Load environment variables from .env.vault files
- ✅ Expand environment variables API_URL=$API_BASE/users
- ✅ Define environment variables for a specific environment (e.g. .env.production)
- ✅ Load priorities of .env.* files (e.g. .env.production > .env)
- ✅ Hierarchical cascading configuration in monorepo projects (Nx, Turbo, etc.) apps/next-app/.env > apps/.env > .env

## Usage

```bash
npx @devmy/dotenv2shell [options]
```

### Options

* `-o, --override`: Override existing environment variables on your machine with values from the `.env` file (default: false).
* `-e, --environment`: Environment to load (`.env.{environment}`).
* `-p, --prefix`: Prefix to filter environment variables to load (e.g., `MY_APP_`).
* `-r, --root`: Root directory to search for the `.env` file (default: current working directory).
* `-f, --files`: multi parameter of `.env` files to load (e.g., `-f .env -f .env.vault -f .env.local`, default: `['.env.vault', '.env']`).
* `-d, --dotenv_key`: Manually specify the `DOTENV_KEY` for decryption (if using `.env.vault`).
* `-c, --cwd`: Specify manually the cwd (Current Working Directory).

### Examples

* Load the default `.env` file from the current directory:

```bash
eval $(npx @devmy/dotenv2shell)
```

* Load a specific `.env` file with a prefix and override existing variable:

```zsh
eval $(npx @devmy/dotenv2shell -f my-env.env -p MY_APP_ -o)
```

## Handling Backslash Escapes

In some cases, environment variables loaded from the `.env` file may contain special characters that require backslash escapes to be interpreted correctly by the shell. This is particularly relevant when dealing with paths, file names, ssh-keys or other strings that might contain characters like spaces, commas, or backslashes themselves.

If you encounter issues with environment variables not behaving as expected, check for any special characters in their values and consider using backslash escapes to ensure they are treated as literal characters. For example:

```bash
eval $(npx @devmy/dotenv2shell) &&
echo -e "$DEPLOY_GITHUB_SSH_KEY" | ssh-add -
```


Remember that the -e option in echo is used to enable backslash escapes when printing strings, but it's not necessary when loading environment variables. The shell will automatically handle backslash escapes when interpreting environment variable values.