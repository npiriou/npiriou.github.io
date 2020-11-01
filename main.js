
let tabCells = [];
numeroterBoard();
initialisationCellules();
initialisationSorts();




let game = {};
game.phase = "TURN_PLAYER_MOVE";
game.sortActif = null;
game.mobActif = null;
game.level = 0;
game.effets=[];


charger();

playerSave = Object.assign({}, player);
ajouterJoueur();
poidsSelonLevel();
remplirSelonPoids();


initialiserObstacles();
initCdSorts();
triggerDebutCombat();
refreshBoard();



addOnClic();

addOnClicPrevisuSort();

player.afficherStatsEntite();
addHoverCell();
afficherModalSkin();


