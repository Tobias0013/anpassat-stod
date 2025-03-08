# Development Guide

## Project Folder Structure

The project is organized into the following main directories:

```
├── client/
│   ├── components/
│   │   ├── header/
│   │   │   ├── header.css
│   │   │   └── header.tsx
│   ├── controllers/
│   │   └── api/
│   ├── pages/
│   │   ├── login/
│   │   │   ├── login.css
│   │   │   └── login.tsx
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
    - **header/**: Header component files.
      - **header.css**: Styles for the header component.
      - **header.tsx**: Header component implementation.
  - **controllers/**: Controllers for handling API/network interactions.
    - **api/**: API interaction controllers.
  - **pages/**: Page components representing different pages.
    - **login/**: Login page files.
      - **login.css**: Styles for the login page.
      - **login.tsx**: Login page implementation.
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