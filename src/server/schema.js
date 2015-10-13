import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} from 'graphql/type';

import {resolver} from 'graphql-sequelize';
import co from 'co';
import u from './user';

export default function(sequelize) {

  var User = u(sequelize);

  var userType = new GraphQLObjectType({
    name: 'User',
    description: 'User creator',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'The id of the user.',
      },
      name: {
        type: GraphQLString,
        description: 'The name of the user.',
      }
    })
  });

  var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        user: {
          type: userType,
          args: {
            id: {
              name: 'id',
              type: new GraphQLNonNull(GraphQLInt)
            }
          },
          resolve: resolver(User)
        }
      }
    }),

    // mutation
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        createUser: {
          type: userType,
          args: {
            name: {
              name: 'name',
              type: GraphQLString
            }
          },
          resolve: (obj, {name}, source, fieldASTs) => co(function *() {
            yield User.sync();
            return yield User.create({name: name});
          })
        },
        deleteUser: {
          type: userType,
          args: {
            id: {
              name: 'id',
              type: new GraphQLNonNull(GraphQLInt)
            }
          },
          resolve: (obj, {id}, source, fieldASTs) => co(function *() {
            yield User.sync();
            let deletedUser = yield User.findById(id);
            yield User.destroy({where: {id: id}});
            return deletedUser;
          })
        },
        updateUser: {
          type: userType,
          args: {
            id: {
              name: 'id',
              type: new GraphQLNonNull(GraphQLInt)
            },
            name: {
              name: 'name',
              type: GraphQLString
            }
          },
          resolve: (obj, {id, name}, source, fieldASTs) => co(function *() {
            yield User.sync();
            yield User.update({
              name: name
            }, {
              where: {
                id: id
              }
            });
            return yield User.findById(id);
          })
        }
      }
    })
  });

  return schema;
}
