const bcrypt = require('bcrypt');

const hash = "$2b$10$tHw4U5jSGzgy5oAgI/xpd.ZDMCIpTnGXc6NQ2Vr7QmSbsuhz77.uK";
const passwordGuess = "yuktha";

bcrypt.compare(passwordGuess, hash)
  .then(result => {
    console.log(result ? "✅ Password matches!" : "❌ Password does NOT match.");
  })
  .catch(err => console.error("Error comparing password:", err));
