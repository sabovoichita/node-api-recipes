var express = require("express");
var router = express.Router();
var fs = require("fs");

const DATA_PATH = "data/recipes.json";

/**
 *
 */
router.get("/", function (req, res, next) {
  console.log("reading file %o", DATA_PATH);
  const recipes = getRecipes();
  res.json(recipes);
});

/**
 *
 */
router.post("/create", function (req, res, next) {
  const title = req.body.title;
  const image = req.body.image;
  const ingredients = req.body.ingredients;
  const link = req.body.link;

  const recipes = getRecipes();
  const id = Math.random().toString(36).substring(7) + new Date().getTime();

  recipes.push({
    id,
    title,
    image,
    ingredients,
    link
  });

  setRecipes(recipes);

  res.json({ success: true, id });
  res.status(201);
});

/**
 *
 */
router.delete("/delete", function (req, res, next) {
  const id = req.body.id;

  const recipes = getRecipes().filter(recipe => recipe.id != id);

  setRecipes(recipes);

  res.json({ success: true });
});

/**
 *
 */
router.put("/update", function (req, res, next) {
  const id = req.body.id;
  const title = req.body.title;
  const image = req.body.image;
  const ingredients = req.body.ingredients;
  const link = req.body.link;

  const recipes = getRecipes();

  const recipe = recipes.find(recipe => recipe.id == id);
  if (recipe) {
    recipe.title = title;
    recipe.image = image;
    recipe.ingredients = ingredients;
    recipe.link = link;
  }

  setRecipes(recipes);

  res.json({ success: true });
});

function getRecipes() {
  const content = fs.readFileSync(DATA_PATH);
  return JSON.parse(content);
}

function setRecipes(recipes) {
  const content = JSON.stringify(recipes, null, 2);
  fs.writeFileSync(DATA_PATH, content);
}

module.exports = router;
