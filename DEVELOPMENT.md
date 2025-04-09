# Development Guide

## Technology Stack

The project uses the following technologies:

- **Frontend**: The client-side is built using [React](https://reactjs.org/), a popular JavaScript library for building user interfaces.
- **Backend**: The server-side is implemented with [Express](https://expressjs.com/), a minimal and flexible Node.js web application framework.
- **TypeScript**: Both the frontend and backend are written in [TypeScript](https://www.typescriptlang.org/).

## Project Folder Structure

The project is organized into the following main directories:

```
├── client/
│   ├── components/
│   ├── controllers/
│   │   └── api/
│   ├── pages/
│   ├── resources/
│   │   ├── text/
│   │   └── types/
├── server/
│   ├── controllers/
│   │   └── database/
│   ├── routes/
│   ├── resources/
│   │   ├── mongoose/
│   │   └── types/
├── package.json
├── README.md
├── DEVELOPMENT.md
├── .gitignore
├── package-lock.json
├── .babelrc
├── tsconfig.json
├── webpack.config.js
├── typedoc.json
├── tsconfig.typedoc.json
└── .dependency-cruiser.js
```

- **client/**: Contains the client-side code of the application.
  - **components/**: Reusable UI components.
  - **controllers/**: Controllers for handling API/network interactions.
    - **api/**: API interaction controllers.
  - **pages/**: Page components representing different pages.
  - **resources/**: Additional resources for the client.
    - **text/**: Text resources.
    - **types/**: Type definitions.
- **server/**: Contains the server-side code of the application.
  - **controllers/**: Controllers for handling database interactions.
    - **database/**: Database interaction controllers.
  - **routes/**: Server routes.
  - **resources/**: Additional resources for the server.
    - **mongoose/**: Mongoose schemas and models.
    - **types/**: Type definitions.
- **.babelrc**: Babel configuration file.
- **.dependency-cruiser.js**: Dependency Cruiser configuration file.
- **.gitignore**: Git ignore file.
- **DEVELOPMENT.md**: Development guide for the project.
- **Makefile**: Makefile for running common tasks.
- **package-lock.json**: Lockfile for npm dependencies.
- **package.json**: Project metadata and dependencies.
- **README.md**: Overview of the project.
- **tsconfig.json**: TypeScript configuration file.
- **tsconfig.typedoc.json**: TypeScript configuration file for TypeDoc.
- **typedoc.json**: TypeDoc configuration file.
- **webpack.config.js**: Webpack configuration file.

## Code Quality

To ensure high code quality, the following practices are followed:

### Code Style
- Use 2 spaces for indentation to maintain consistency across the codebase.

### Documentation
- Require JSDoc docstrings for all functions and classes to ensure proper documentation.