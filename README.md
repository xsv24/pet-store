## ๐ Description
Pet store API built using [nestjs](https://nestjs.com/) with openapi swagger docs.

### Endpoints
- [Swagger docs](http://localhost:3000/api/)
- [API](http://localhost:3000/v1/pets)

### ๐ฎ Future Improvements
- pipeline: lint -> test -> static code analysis -> code coverage -> build docker image -> deploy
- Database
- Structured logging
- Addition of metrics -> request latency, success & error rate, ..
- Bearer Authentication & user roles especially around the mutation endpoints.
- With the addition of a database it's "health should be checked in our `/up` health endpoint.
- Clean up of common swagger doc properties & descriptions.

## โณ Installation

```bash
yarn install
```

## ๐ Running the app

### Development
```bash
yarn start
```

```bash
yarn start:watch
```
### Production
```bash
yarn start:prod
```

## ๐งช Test

```bash
yarn test
```
```bash
yarn test:watch
```

## ๐ Coverage

> Generate a code coverage report from tests.

```bash
yarn test:cov
```

## ๐ Lint / format

> Lint code to keep consistent formatting for both eslint & prettier.

```bash
yarn lint:fix
```


> Ideally this would be checked in the pipeline or run on a git hook.
