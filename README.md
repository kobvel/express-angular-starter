#MEAN RELATIONAL BOILERPLATE

A boilerplate using NodeJs, Express, Sequelize, Apidoc, Eslint, Mocha, Cluster and the best practices.

## Getting up and running

1. Clone the repository
2. `npm install`
2. `bower install`
3. `gulp`
4. Visit `https://localhost:9000`

## Some command

```
gulp             # run api and web
gulp web:serve   # run just web server
gulp api:serve   # run just api server
gulp api:tests   # run mocha tests
gulp web:tests   # run karma tests
gulp api:docs    # Generate the apidoc
docker-compose build                        # build docker image
docker-compose run meannode1 gulp api:tests # run api tests on docker
docker-compose run meannode1 gulp web:tests # run web tests on docker
docker-compose up                           # run docker image
```

## Coding Style

The coding style used is the airbnb one: https://github.com/airbnb/javascript

You can configure it in the `.eslintrc` file.

## Architecture

The architecture is MVR (Model View Route)

The API files are structured in the following manner:
```
libs        (Configurations files and libs)
models      (Sequelize models)
routes      (Express routes, the comments in this folder are used to generate the apidoc)
test        (mocha test, 'npm test' to run it)
auth.js     (Configuration for JWT auth (JSON With Token))
cluster.js  (Used to run in cluster mode. We could use https://github.com/Unitech/pm2 too)
index.js    (Entry point)
```

If you want to have a better understanding of the architecture, I recommend you to read [Caio Ribeiro Pereira's book](https://leanpub.com/building-apis-with-nodejs).

## Credit

This project is base on [node-express-sequelize-es2015](https://github.com/ArnaudValensi/node-express-sequelize-es2015)