const knex = require('../config/knex');

const RefreshToken = {
  
  async create(userId, token, expireAt) {
    const [row] = await knex('refresh_tokens')
      .insert({ user_id: userId, token, expire_at: expireAt })
      .onConflict('user_id')      
      .merge({ token, expire_at: expireAt }) 
      .returning('*');
    return row;
  },

  async findByToken(token) {
    return knex('refresh_tokens').where({ token }).first();
  },

  async deleteByToken(token) {
    return knex('refresh_tokens').where({ token }).del();
  },

  async deleteByUserId(userId) {
    return knex('refresh_tokens').where({ user_id: userId }).del();
  },

  async revokeAllForUser(userId) {
    return knex('refresh_tokens').where({ user_id: userId }).del();
  }
};

module.exports = RefreshToken;
