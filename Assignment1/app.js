const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.get("/search", async (req, res) => {
  res.render("search");
});

app.get("/profile/:id", async (req, res) => {
  const statMaxVal = {
    hp: 100,
    attack: 100,
    defense: 100,
    "special-attack": 200,
    "special-defense": 200,
    speed: 150,
    height: 20,
    weight: 1000,
  };
  const titleCase = (aString) => aString[0].toUpperCase() + aString.slice(1);
  const formatStatsAttributeName = (attributeName) => {
    const nameTokens = attributeName
      .split("-")
      .map((nameToken) => titleCase(nameToken));
    return nameTokens.join(" ");
  };
  const normalizeStat = (attribute, val) => {
    return val / statMaxVal[attribute];
  };

  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
  const response = await fetch(url);
  const pokemon = await response.json();

  console.log(pokemon);
  const { id, name, height, weight, stats, abilities, sprites } = pokemon;

  const statistics = stats.map((stat) => ({
    attribute: formatStatsAttributeName(stat.stat.name),
    val: normalizeStat(stat.stat.name, stat.base_stat),
  }));

  statistics.push(
    { attribute: "height", val: normalizeStat("height", height) },
    { attribute: "weight", val: normalizeStat("weight", weight) }
  );
  const pokeinfo = {
    id,
    name: titleCase(name),
    imageUrl: sprites.other["official-artwork"].front_default,
    statistics,
    abilities: abilities.map((ability) => titleCase(ability.ability.name)),
  };

  res.render("profile", { pokemon: pokeinfo });
});

app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}.`);
});