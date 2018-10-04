# health-check

> A GitHub App built with [Probot](https://github.com/probot/probot) that handles custom checks for internal projects

## Checks

This project serves as a PoC for GitHub Checks https://developer.github.com/v3/checks/

### Language Files (Done)

This check looks for issues within `lang.js` files.

- Should not contain arrays
- Should not contain booleans
- Should not contain functions

### File Size (TODO)

This check looks at all files.

- Should be under 1mb in size

### JSON Parse (TODO)

This check looks at .json files that have been edited in this commit

- Should parse

## Setup

```sh
# Install dependencies
npm install

# Run typescript
npm run build

# Run the bot
npm start
```

## Developing

- Requires wti cli for updating translation files

```sh
gem install web_translate_it
```

Create a `.wti` file in `./locales/` with the API key for webtranslateit

```
api_key: proj_pvt_Nu2ECXxskpCiF2bKGPcbsw
```

### Pulling Translation Files

```sh
$ cd locales
$ wti pull
```

## Contributing

If you have suggestions for how health-check could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 Edward Knowles <mail@eknowles.com>

