
let tabCells = [];
initialisationCellules();
initialisationSorts();
numeroterBoard();

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

tabCells[0].contenu=player;
tabCells[66].contenu=artillerie;
tabCells[77].contenu=ogre;

for (let i = 0; i < tabCells.length; i++) {
    if (contientEntite(tabCells[i]))
        continue;
    if(getRandomInt(5) == 0)
        tabCells[i].contenu = test.clone();
    
}

refreshBoard();

addPrevisuPM();

addOnClic();

 addOnClicPrevisuSort();

 
let game = {};
game.phase = "TURN_PLAYER_MOVE";
game.sortActif = null;