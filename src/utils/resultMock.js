function generateMockResult() {
  const outcomes = ["Low", "High", "Peak"];
  const result = outcomes[Math.floor(Math.random() * outcomes.length)];

  const metrics = {
    E3G: Number((Math.random() * 100).toFixed(2)),
    PDG: Number((Math.random() * 100).toFixed(2)),
    FSH: Number((Math.random() * 100).toFixed(2))
  };

  return { result, metrics };
}

module.exports = { generateMockResult };
