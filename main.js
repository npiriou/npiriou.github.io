
let tabCells = [];
initialisationCellules();
initialisationSorts();
numeroterBoard();

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
playerSave = player.clone();

let game = {};
game.phase = "TURN_PLAYER_MOVE";
game.sortActif = null;
game.mobActif = null;
game.level = 0;
// tabCells[0].contenu=player;
// tabCells[14].contenu=orc.clone();
ajouterJoueur();
poidsSelonLevel();
remplirSelonPoids();


initialiserObstacles();
initCdSorts();
refreshBoard();



addOnClic();

addOnClicPrevisuSort();

player.afficherStatsEntite();
addHoverCell();
