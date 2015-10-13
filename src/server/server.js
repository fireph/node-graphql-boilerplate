import path from 'path';
import koa from 'koa';
import Router from 'koa-router';
import qs from 'koa-qs';
import parseBody from 'co-body';
import Sequelize from 'sequelize';
import {graphql} from 'graphql';
import s from './schema';
import ECT from 'ect';
import serve from 'koa-static';

let port = process.env.PORT || 3000;
let routes = new Router();
var app = koa();

var clientPath = path.join(__dirname, '../client/');
var renderer = ECT({
  root: path.join(clientPath, 'views')
});

// support nested query tring params
qs(app);

var sequelize = new Sequelize('postgres://fmeyer@localhost:5432/fmeyer');
var schema = s(sequelize);

routes.get('/', function*() {
  this.body = renderer.render('index.ect', {});
})

routes.get('/gql', function* () {
  var query = this.query.query;
  var params = this.query.params;

  var resp = yield graphql(schema, query, '', params);

  if (resp.errors) {
    this.status = 400;
    this.body = {
      errors: resp.errors
    };
    return;
  }

  this.body = resp;
});

routes.post('/gql', function* () {
  var payload = yield parseBody(this);
  var resp = yield graphql(schema, payload.query, '', payload.params);

  if (resp.errors) {
    this.status = 400;
    this.body = {
      errors: resp.errors
    };
    return;
  }

  this.body = resp;
});

app.use(routes.middleware());

app.use(serve(path.join(clientPath, 'static')));

app.listen(port, () => {
  console.log('app is listening on ' + port);
});

module.exports = app;
