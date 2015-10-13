import request from 'superagent';
import Debug from 'debug';

var debug = new Debug('client:mutation');
var userId = 1001;
var deleteId = 1002;
var names = ['Doe', 'Smith', 'Winston', 'Lee', 'Foo', 'Bar'];
var name = names[Math.floor(Math.random() * names.length)];

request
  .post('http://localhost:3000/gql')
  .send({
    query: `
    mutation M($userId: Int! $name: String!) {
      updateUser(id: $userId name: $name) {
        id,
        name
      }
    }
    `,
    params: {
      userId: userId,
      name: name
    }
  })
  .end(function (err, res) {
    if (err) debug(err);
    debug('updated Chewbacca to ' + name, res.body);
  });

request
  .post('http://localhost:3000/gql')
  .send({
    query: `
    mutation M($name: String!) {
      createUser(name: $name) {
        id,
        name
      }
    }
    `,
    params: {
      name: 'Wedge'
    }
  })
  .end(function (err, res) {
    if (err) debug(err);
    debug('created Wedge', res.body);
  });

request
  .post('http://localhost:3000/gql')
  .send({
    query: `
    mutation M($userId: Int!) {
      deleteUser(id: $userId) {
        id,
        name
      }
    }
    `,
    params: {
      userId: deleteId
    }
  })
  .end(function (err, res) {
    if (err) debug(err);
    debug('deleted R2D2', res.body);
  });
