const db = require("../config/db");

const Test = {
  async create(userId) {
    const [test] = await db("tests")
      .insert({ user_id: userId, status: "pending" })
      .returning("*");
    return test;
  },

  async updateStatus(testId, status, fields = {}) {
    return db("tests")
      .where({ id: testId })
      .update({
        status,
        ...fields,
        updated_at: db.fn.now(),
      });
  },

  async findById(testId) {
    return db("tests").where({ id: testId }).first();
  },

  async findByUser(userId) {
    return db("tests")
      .where({ user_id: userId })
      .orderBy("test_created_at", "desc");
  },

  async findByUserAndDate(userId, date) {
    // date expected in 'YYYY-MM-DD' format
    return db("tests")
      .where({ user_id: userId })
      .andWhereRaw("DATE(test_created_at) = ?", [date])
      .orderBy("test_created_at", "asc");
  },

  async updateRelevant(testId, isRelevant) {
    return db("tests")
      .where({ id: testId })
      .update({
        is_relevant: isRelevant,
        updated_at: db.fn.now(),
      });
  },
 async findRelevantByUser(userId) {
    return db("tests")
      .where({ user_id: userId, is_relevant: true })
      .orderBy("test_created_at", "asc");
  }
 
};



module.exports = Test;
