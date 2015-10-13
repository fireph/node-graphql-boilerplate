import request from 'superagent';
import Debug from 'debug';

var debug = new Debug('client:query');
var userId = 1000;

request
  .get('http://localhost:3000/gql')
  .query({
    query: `{
      user(id: ${userId}) {
        id,
        name
      }
    }`
  })
  .end(function (err, res) {
    if (err) debug(err);
    debug('query Han Solo', res.body);
  });
