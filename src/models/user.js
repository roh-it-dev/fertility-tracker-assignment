const knex = require('../config/knex');

const User = {
  async create(username, email, hashedPassword) {
    const [row] = await knex('users')
      .insert({ username, email, password: hashedPassword })
      .returning('*');
    return row;
  },

  async findByEmail(email) {
    return knex('users').where({ email }).first();
  },

  async findById(id) {
    return knex('users').where({ id }).first();
  }
};

module.exports = User;
