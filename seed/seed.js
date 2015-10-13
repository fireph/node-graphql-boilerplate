import Sequelize from 'sequelize';
import u from '../src/server/user';

// connect to postgres
var sequelize = new Sequelize('postgres://fmeyer@localhost:5432/fmeyer');
var User = u(sequelize);

// seed users
var users = [
  {
    id: 1000,
    name: 'Han Solo'
  },
  {
    id: 1001,
    name: 'Chewbacca'
  },
  {
    id: 1002,
    name: 'R2D2'
  },
  {
    id: 1003,
    name: 'Luke Skywalker'
  }
];

User.drop().then(function() {
  User.sync({force: true}).then(function() {
    User.bulkCreate(users).then(function() {
      console.log('Seed data created.');
    });
  });
});
