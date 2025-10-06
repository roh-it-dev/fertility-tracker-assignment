const Test = require("../models/test");

async function mockRandomRelevantTest(userId, date) {
  const todaysTests = await Test.findByUserAndDate(userId, date);

  if (todaysTests.length === 0) return;

  const randomIndex = Math.floor(Math.random() * todaysTests.length);
  const selectedTest = todaysTests[randomIndex];

  // Update all today's tests: selected one true, rest false
  await Promise.all(
    todaysTests.map(t =>
      Test.updateRelevant(t.id, t.id === selectedTest.id)
    )
  );
}

module.exports = { mockRandomRelevantTest };
