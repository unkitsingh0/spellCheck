const express = require("express");
const Typo = require("typo-js");
const dictionary = new Typo("en_US");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 9000;
//middleware
app.use(express.json());
app.use(cors());

function checkSpell(spell) {
  var is_spelled_correctly = dictionary.check(spell);

  if (!is_spelled_correctly) {
    let suggestion = dictionary.suggest(spell);
    return { response: is_spelled_correctly, spelling: spell, suggestion };
  } else {
    return { response: is_spelled_correctly, spelling: "", suggestion: "" };
  }
}

app.get("/s/:spell", (req, res) => {
  let spelling = req.params.spell;

  res.send({ status: "ok", data: checkSpell(spelling) });
});

app.post("/m", (req, res) => {
  let spellingArray = req.body.spellingArray;

  let resArray = spellingArray.map((spell) => {
    return checkSpell(spell);
  });

  res.send(resArray);
});
app.listen(PORT, (e) => {
  console.log(`Server is running on port no ${PORT}`);
});
