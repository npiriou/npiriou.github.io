function addOnClicPrevisuSort() {
    for (let index = 0; index < player.sorts.length; index++) {
        document.getElementsByClassName("sort")[index].addEventListener("click", previsuSort);
    }
}

function previsuSort(sortClique) {
    let sortUtilise;

    if (typeof sortClique == "number") { sortUtilise = sortClique; }
    else sortUtilise = this.dataset.sort;

    if (game.phase.includes("TURN_PLAYER")) {
        retirerToutesPrevisuSort();
        if ((player.sorts[sortUtilise].coutPA <= player.PAact)
            && player.cdSorts[sortUtilise] == 0) {

            game.phase = "TURN_PLAYER_SPELL";

            game.sortActif = player.sorts[sortUtilise];
            for (let index = 0; index < document.getElementsByClassName("cell").length; index++) {
               let cellboiteee = document.getElementsByClassName("cell")[index];
                if (game.sortActif.estAPortee(player.pos(), index, player.POBonus)
                    && (!game.sortActif.LdV || isInSight(player.pos(), index))) {
                    cellboiteee.classList.add("previsuSort");
                }
            }
        }
    }
}

function retirerToutesPrevisuSort() {

    for (let index = 0; index < document.getElementsByClassName("cell").length; index++) {
        document.getElementsByClassName("cell")[index].classList.remove("previsuSort");
    }
}


function addHoverCell() {
    for (let index = 0; index < document.getElementsByClassName("cell").length; index++) {
        //if (contientEntite(tabCells[index]) && (tabCells[index].contenu.nom != "boite")) {
        document.getElementsByClassName("cell")[index].addEventListener("mouseover", onHoverCell);
        document.getElementsByClassName("cell")[index].addEventListener("mouseout", onMouseOutOfCell);
    }
}
function onHoverCell() {

    if (contientEntite(tabCells[this.id]) && tabCells[this.id].contenu.nom != "boite") {
        tabCells[this.id].contenu.afficherStatsEntite();
    }
    else if (estVide(tabCells[this.id])) {
        if (game.phase != "TURN_PLAYER_MOVE"){return;}
       let chemin = estAPorteeDeDeplacement(player.pos(), this.id, player.PMact);
        if (chemin) {
            for (let i = 0; i < chemin.length; i++) {
                document.getElementsByClassName("cell")[posFromxy(chemin[i][0], chemin[i][1])].classList.add("previsuPMPlusieurs");
            }
        }
    }
}

function onMouseOutOfCell(){
    for (let index = 0; index < document.getElementsByClassName("cell").length; index++)
    document.getElementsByClassName("cell")[index].classList.remove("previsuPMPlusieurs");
}

function onHoverSort() {
    if (player.sorts[this.dataset.sort]) {
        player.sorts[this.dataset.sort].afficherStatsSort();
    }

}



window.onkeydown = function (event) {
    if ((event.keyCode == 27) && game.phase == "TURN_PLAYER_SPELL") {
        retirerToutesPrevisuSort();
        game.phase = "TURN_PLAYER_MOVE";
    }
    if ((event.keyCode == 32) && game.phase.includes("TURN_PLAYER")) {
        passerTourJoueur();
    }
    if ((event.keyCode == 65) && game.phase.includes("TURN_PLAYER") && player.sorts[0]) {
        previsuSort(0);
    }
    if ((event.keyCode == 90) && game.phase.includes("TURN_PLAYER") && player.sorts[1]) {
        previsuSort(1);
    }
    if ((event.keyCode == 69) && game.phase.includes("TURN_PLAYER") && player.sorts[2]) {
        previsuSort(2);
    }
    if ((event.keyCode == 82) && game.phase.includes("TURN_PLAYER") && player.sorts[3]) {
        previsuSort(3);
    }
    if ((event.keyCode == 84) && game.phase.includes("TURN_PLAYER") && player.sorts[4]) {
        previsuSort(4);
    }
    if ((event.keyCode == 89) && game.phase.includes("TURN_PLAYER") && player.sorts[5]) {
        previsuSort(5);
    }
    if ((event.keyCode == 85) && game.phase.includes("TURN_PLAYER") && player.sorts[6]) {
        previsuSort(6);
    }
    if ((event.keyCode == 73) && game.phase.includes("TURN_PLAYER") && player.sorts[7]) {
        previsuSort(7);
    }
    if ((event.keyCode == 79) && game.phase.includes("TURN_PLAYER") && player.sorts[8]) {
        previsuSort(8);
    }
    if ((event.keyCode == 80) && game.phase.includes("TURN_PLAYER") && player.sorts[9]) {
        previsuSort(9);
    }
};





