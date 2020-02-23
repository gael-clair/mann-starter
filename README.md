# MongoDB Angular NestJS Node.js (MANN) starter <!-- omit in toc -->

<p> 
<a href="https://github.com/gael-clair/mann-starter/blob/master/LICENSE"><img src="https://img.shields.io/github/license/gael-clair/mann-starter" alt="License" /></a><br/>
<a href="https://github.com/gael-clair/mann-starter/issues"><img src="https://img.shields.io/github/issues/gael-clair/mann-starter" alt="Issues" /></a><br/>
<a href="https://codecov.io/gh/gael-clair/mann-starter"><img src="https://img.shields.io/codecov/c/gh/gael-clair/mann-starter?token=89069b436ef2496eb7ff4a2c53e83a49" /></a><br/>
</p>

## Packages

<p>
<a href="https://github.com/gael-clair/mann-starter"><img src="https://github.com/gael-clair/mann-temp/workflows/Package:%20Backend/badge.svg" /><br/>
<a href="https://github.com/gael-clair/mann-starter"><img src="https://github.com/gael-clair/mann-temp/workflows/Package:%20Frontend/badge.svg" />
</p>

## Table of Contents <!-- omit in toc -->

- [Packages](#packages)
- [About this project](#about-this-project)
  - [Built with](#built-with)
- [Getting Started](#getting-started)
- [Before You Begin](#before-you-begin)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Build](#build)
  - [Development](#development)
  - [Test](#test)
  - [Lint](#lint)
  - [Format](#format)
- [Continuous Integration](#continuous-integration)
  - [Workflow steps](#workflow-steps)
  - [Github configuration](#github-configuration)
  - [Checks on Pull Requests](#checks-on-pull-requests)
- [Licence](#licence)
- [Acknowledgements](#acknowledgements)

## About this project

The MongoDB Angular Nodejs NestJS (MANN) stack starter provides a monorepo integrating, a frontend application and a backend server coded in Typescript.

### Built with

- [Node.js (Javascript Engine)](https://nodejs.org/)
- [Yarn v1 (Package Manager)](https://classic.yarnpkg.com/)
- [Angular (Frontend)](https://angular.io/)
- [NestJS (Backend)](https://nestjs.com/)

## Getting Started

## Before You Begin

Before you begin we recommend you read about the basic building blocks that assemble a Mann application:

- MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
- Angular - Angular's [Official Website](https://angular.io/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and [Egghead Videos](https://egghead.io/).
- Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.
- NestJS - The best way to understand NestJS is through its [Official Website](https://nestjs.com/), which has a good [documentation](https://docs.nestjs.com/).

### Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
- MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
- Yarn (v1) - You're going to use the [Yarn Package Manager](http://bower.io/) to manage your packages and dependencies. Follow these [instructions](https://yarnpkg.com/getting-started/) to install Yarn.

### Installation

1.  Clone the repo

```git
$ git clone https://github.com/gael-clair/mann-starter.git YOUR_REPO_FOLDER
```

2.  Get into repo folder

```sh
$ cd YOUR_REPO_FOLDER
```

3.  Add your repo as origin

```git
$ git remote add origin YOUR_REPO_URL
```

4.  Install dependencies

```sh
$ yarn install
```

5.  Change repository URL in package.json

```json
{
  ...
  "repository": "YOUR_REPO_URL",
  ...
}
```

6.  Optional: Add original repo as upstream (to stay up to date with last mann-starter version):

```git
$ git remote add upstream https://github.com/gael-clair/mann-starter.git
```

## Usage

### Build

To build all packages:

```sh
$ yarn build
```

### Development

To start concurrently backend server and frontend development server with live reload:

```sh
$ yarn start
```

### Test

To launch unit tests of all packages:

```sh
$ yarn test
```

To launch end-to-end tests of all packages:

```sh
$ yarn e2e
```

### Lint

To lint all packages:

```sh
$ yarn lint
```

To lint and fix all packages:

```sh
$ yarn lint:fix
```

### Format

To format with Prettier all packages:

```sh
$ yarn format
```

## Continuous Integration

The repo includes a [Github Action](https://github.com/features/actions) configuration for continuous integration. It is also integrated with [Codecov](https://codecov.io/) during workflow process. Each package of this repo has its own package (backend and frontend).

### Workflow steps

- Install (with cache)
- Build
- Lint
- Unit tests
- Codecov upload result of unit tests
- End-to-End tests
- Codecov upload result of End-to-End tests

### Github configuration

To configure Codecov integration, you have to add one environment variables in _Repo Settings > Secrets > Add a new secret_

```properties
CODECOV_TOKEN = YOUR_CODECOV_REPO_TOKEN
```

### Checks on Pull Requests

To be sure to pass all checks before merging a Pull Request you should add required checks in _Repo Settings > Rbanches > Branch protection rules > Require status checks to pass before merging_ :

- codecov/project/e2e-tests
- codecov/project/unit-tests
- Backend: Checks (build, lint, tests)
- Frontend: Checks (build, lint, tests)

## Licence

Distributed under the MIT License (see [licensed](LICENSE) for more information).

<!-- ## Contact

Gaël CLAIR -->

## Acknowledgements

- [Angular](https://angular.io/)
- [NestJS](https://nestjs.com/)
- [Angular Material (UI Design)](https://material.angular.io/)
- [MongoDB (Database Engine)](https://www.mongodb.com/)
- [Mongoose (ODM)](https://mongoosejs.com/)
- [Winston (Logging)](https://github.com/winstonjs/winston)
- [Jest (Tests)](https://jestjs.io/)
- [Puppeteer (Tests)](https://pptr.dev/)
- [Prettier (Formatting)](https://prettier.io/)
- [ESLint (Linting)](https://eslint.org/)
- [TSLint (Linting)](https://palantir.github.io/tslint/)
- [Stylelint (Linting)](https://stylelint.io/)
- [Lint-Staged (Linting)](https://github.com/okonet/lint-staged)
- [Typescript (Language)](https://www.typescriptlang.org/)
- [Husky (Git hook)](https://github.com/typicode/husky)
- [Commitizen (Git template cli)](http://commitizen.github.io/cz-cli/)
- [Commitlint (Linting of git commit message)](https://commitlint.js.org/)
- [Codecov (Code coverage)](https://codecov.io/)
