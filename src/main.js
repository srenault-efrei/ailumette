const chalk = require("chalk");
const map = require("./map");
const main = () => {
  console.log("\n");
  console.log(chalk.cyan("Le jeu des ailumettes peut commencer 😎"));

  map();
};

main();
