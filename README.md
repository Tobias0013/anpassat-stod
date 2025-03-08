# (TITLE)

## Description

//TODO: add project description

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits](#credits)

## Installation

To install and set up this project, follow these steps:

1. Clone the repository: `git clone https://github.com/Tobias0013/se_unit_webb.git`
2. Install the required dependencies: `npm install`
3. Configure the environment variables:
   - Create a new file named `.env` in the root directory of the project.
   - Open the `.env` file and add the following environment variables:
     ```
     //TODO: ADD ENVIROMENT VARIABLES
     PORT=(port for backend)
     ```
4. Then run the project with `npm start`

## Deploy

To use deplay this project, follow these steps:

1. Follow the [installation](#installation) guide.
2. Run the script `npm run build`
3. Start the server: `npm start-build`
4. Open your web browser and navigate to `http://localhost:"port-enterd-in-.env"`

## Development

### Scripts

The following scripts are available for development and deployment:

- `npm start`: This script starts both the server and client concurrently in development mode.
- `npm run server`: This script starts the server using `nodemon` to automatically restart it when changes are detected.
- `npm run client`: This script starts the webpack development server for the client-side code in development mode and opens it in the default web browser.
- `npm run build`: This script builds both the client-side and server-side code for production.
- `npm run build:client`: This script builds the client-side code for production using webpack in production mode.
- `npm run build:server`: This script compiles the server-side TypeScript code to JavaScript.
- `npm run start:build`: This script opens the built client in the default web browser at `http://localhost:3000` and starts the server.
- `npm run doc`: This script generates documentation for both the client and server.
- `npm run doc:typedoc`: This script generates TypeScript documentation using `typedoc`.
- `npm run doc:client`: This script generates client-side documentation and dependency graphs.
- `npm run doc:server`: This script generates server-side documentation and dependency graphs.
- `npm run clean`: This script removes the `node_modules` directory, documentation, and distribution files.
- `npm run clean:modules`: This script removes the `node_modules` directory.
- `npm run clean:dist`: This script removes the distribution files.
- `npm run clean:doc`: This script removes the documentation files.

### Make Commands

This project supports `make` commands for easier management of development and deployment tasks. You can use the following command to see all available `make` commands:

```sh
make help
```

## Credits

//TODO: ADD ALL CONTRIBUTERS
