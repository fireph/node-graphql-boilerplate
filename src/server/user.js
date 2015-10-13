import Sequelize from 'sequelize';

export default function(sequelize) {
  var User = sequelize.define('user', {
    name: Sequelize.STRING
  });

  return User;
}
