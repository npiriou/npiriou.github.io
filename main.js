
let tabCells = [];
numeroterBoard();
initialisationCellules();
initialisationSorts();




let game = {};
game.phase = "TURN_PLAYER_MOVE";
game.sortActif = null;
game.mobActif = null;
game.level = 0;
// tabCells[0].contenu=player;
// tabCells[14].contenu=orc.clone();

charger();
playerSave = player.clone();

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
