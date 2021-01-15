const chalk = require("chalk");
const readline = require("readline");

// INITILALIZATION  MAP

module.exports = map = () => {
  let firstPos;
  let secondPos;
  let thridPos;

  let x,
    x_length = 7, // lines
    y,
    y_length = 6, // columns
    grille = [];

  for (x = 0; x < x_length; x++) {
    grille[x] = [];
    for (y = 0; y < y_length; y++) {
      firstPos = randomInt(1, 4);
      secondPos = randomInt(1, 4);
      thridPos = randomInt(1, 4);
      if (x === 0 || x === x_length - 1) {
        grille[x][y] = "*";
      } else if (y === firstPos || y === secondPos || y === thridPos) {
        grille[x][y] = "|";
      } else {
        grille[x][y] = " ";
      }
      grille[x][y_length - 1] = "*";
      grille[x][0] = "*";
    }
  }
  parseDisplayMapUser(grille);

  display(grille, x_length, y_length, false);
};

// REQUEST THE USER HIS LINE AND MATCHES
const display = (grille, x_length, y_length, isPlayer) => {
  let line;
  let matches;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  if (isPlayer === false) {
    console.log("A ton tour : ");

    rl.question("Ligne : ", function (data) {
      data = parseInt(data);
      line = data;
      if (erroMessageLine(x_length, data) === true) {
        display(grille, x_length, y_length, isPlayer);
      } else if (erroMessageLine(x_length, data) === false) {
        rl.question("Matchs : ", function (dataMatches) {
          dataMatches = parseInt(dataMatches);
          matches = dataMatches;
          if (errorMessageMatches(grille, dataMatches, data) === true) {
            display(grille, x_length, y_length, isPlayer);
          } else {
            rl.close();
          }
        });
      }
    });
    rl.on("close", function () {
      editMap(grille, line, matches, x_length, y_length, isPlayer);
    });
  } else {
    editMap(grille, null, null, x_length, y_length, isPlayer);
  }
};

// EDIT MAP
const editMap = (
  grille,
  line = null,
  matches = null,
  x_length,
  y_length,
  isPlayer
) => {
  let result = grille[line];

  // USER UPDATE
  if (isPlayer === false) {
    for (let i = 0; i < matches; i++) {
      let index = result.indexOf("|");
      grille[line][index] = " ";
      result = grille[line];
    }
    grille[line] = result;

    console.log(
      chalk.green(
        `Le joueur a supprimé ${matches} match(s) de la ligne ${line} `
      )
    );
  }
  // IA UPDATE
  else {
    let found = false;
    let matchesIa = -1;
    let lineIa = -1;

    for (let i = 0; i < x_length; i++) {
      if (grille[i].includes("|") && found === false) {
        let index = grille[i].indexOf("|");
        grille[i][index] = " ";
        found = true;
        lineIa = i;
        matchesIa = 1;
      }
    }

    console.log(
      chalk.yellow(
        `L'IA a supprimé ${matchesIa} match(s) de la ligne ${lineIa}`
      )
    );
  }

  parseDisplayMapUser(grille);

  if (end(grille, !isPlayer) === true) {
    display(grille, x_length, y_length, !isPlayer);
  }
};

// RANDOM MATCHES
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// LINE SELECTION MESSAGE ERROR

const erroMessageLine = (x_length, line) => {
  let isErrorLine = false;

  if (line > x_length || line === 0) {
    console.log(chalk.red("Erreur: cette ligne est hors de porté"));
    isErrorLine = true;
  } else if (!Number.isInteger(line) || line < 0) {
    console.log(
      chalk.red("Erreur: entrée non valide (nombre positif attendu)")
    );
    isErrorLine = true;
  }

  return isErrorLine;
};

// MATCH CHOICE MESSAGE ERROR

const errorMessageMatches = (grille, matches, x_length) => {
  let isErrorMatches = false;
  let correspondance = defineCorrespondance(grille, x_length);

  if (matches === 0) {
    console.log(
      chalk.red("Erreur: vous devez supprimer au moins une correspondance")
    );
    isErrorMatches = true;
  } else if (!Number.isInteger(matches) || matches < 0) {
    console.log(
      chalk.red("Erreur: entrée non valide (nombre positif attendu)")
    );
    isErrorMatches = true;
  } else if (matches > correspondance) {
    console.log(
      chalk.red("Erreur: pas assez de correspondances sur cette ligne")
    );

    isErrorMatches = true;
  }
  return isErrorMatches;
};

// DEFINE CORRESPONDENCE FOR THE NUMBER OF MATCHES

const defineCorrespondance = (grille, line) => {
  let compteur = 0;
  for (const el of grille[line]) {
    if (el === "|") compteur++;
  }
  // console.log("compteur", compteur);

  return compteur;
};

// INDICATES THE WINNER

const end = (grille, isPlayer) => {
  let bool = false;
  for (const el of grille) {
    if (el.includes("|")) {
      bool = true;
    }
  }
  if (bool === false && isPlayer === false) {
    console.log(chalk.blue("Félicitations, vous avez gagné 🔥 🎉 "));
    process.exit(0);
  } else if (bool === false && isPlayer === true) {
    console.log(chalk.blue("Nul, vous avez perdu 😭 "));
    process.exit(0);
  }

  return bool;
};

// DISPLAY THE MAP IN THE FORM OF A STRING
const parseDisplayMapUser = (grille) => {
  let x,
    x_length = 7, //lignes
    y,
    y_length = 6; //colonnes

  let concatenation = "";
  for (x = 0; x < x_length; x++) {
    concatenation += "\n";
    for (y = 0; y < y_length; y++) {
      concatenation += grille[x][y];
    }
  }
  console.log(concatenation + "\n");
};
