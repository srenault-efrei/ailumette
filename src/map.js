const { match } = require("assert");
const chalk = require("chalk");
const readline = require("readline");

// INITIALISATION DE LA MAP

module.exports = map = () => {
  let firstPos;
  let secondPos;
  let thridPos;

  let x,
    x_length = 7, //lignes
    y,
    y_length = 6, //colonnes
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
      grille[x][5] = "*";
      grille[x][0] = "*";
    }
  }
  // console.log(grille);
  parseDisplayMapUser(grille);

  display(grille, x_length, y_length);
};

// DEMANDE A L'USER SA LIGNE ET SES MATCHES
const display = (grille, x_length, y_length) => {
  let line;
  let matches;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Your turn : ");

  rl.question("Ligne : ", function (data) {
    data = parseInt(data);
    line = data;
    if (erroMessageLine(x_length, data) === true) {
      display(grille, x_length, y_length);
    } else if (erroMessageLine(x_length, data) === false) {
      rl.question("Matchs : ", function (dataMatches) {
        dataMatches = parseInt(dataMatches);
        matches = dataMatches;
        if (errorMessageMatches(grille, dataMatches, data) === true) {
          display(grille, x_length, y_length);
        } else {
          rl.close();
        }
      });
    }
  });
  rl.on("close", function () {
    editMap(grille, line, matches, x_length, y_length);
  });
};

// EDIT LA MAP SELON LES CHOIX DE LA LIGNE ET DES MATCHES
const editMap = (grille, line, matches, x_length, y_length) => {
  let result = grille[line];
  // console.log("grille ", result);

  for (let i = 0; i < matches; i++) {
    let index = result.indexOf("|");
    // console.log("index", index);
    // console.log("char", grille[line][index]);
    grille[line][index] = " ";
    result = grille[line];
    // console.log("result", result);
  }
  grille[line] = result;

  console.log(`Le joueur a supprimé ${matches} match(s) de la ligne ${line} `);

  // console.log("final", grille);
  parseDisplayMapUser(grille);

  if (end(grille) === true) {
    display(grille, x_length, y_length);
  }
};

// RANDOM ALLUMETTES
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ERREUR MESSAGE LORS DU CHOIX DE LA LIGNE

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

// ERREUR MESSAGE LORS DU CHOIX DES MATCHES

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

// DÉFINIT SI IL Y UNE CORRESPONDANCE  POUR MATCHE

const defineCorrespondance = (grille, line) => {
  let compteur = 0;
  for (const el of grille[line]) {
    if (el === "|") compteur++;
  }
  // console.log("compteur", compteur);

  return compteur;
};

//  DETERMINE LE VAINQUEUR ET LA FIN DU JEUX

const end = (grille) => {
  let bool = false;
  for (const el of grille) {
    if (el.includes("|")) {
      bool = true;
    }
  }
  if (bool === false) {
    console.log(chalk.blue("Vous avez gagné contre l'IA !"));
    process.exit(0);
  }
  return bool;
};

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
