
let tabCells = [];
initialisationCellules();
initialisationSorts();
numeroterBoard();

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

tabCells[0].contenu=player;
// tabCells[69].contenu=artillerie;
// tabCells[66].contenu=orc;



initialiserObstacles();
initCdSorts();
refreshBoard();



addOnClic();

addOnClicPrevisuSort();

player.afficherStatsEntite();
addHoverCell();
let game = {};
game.phase = "TURN_PLAYER_MOVE";
game.sortActif = null;
game.mobActif = null;