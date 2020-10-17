
function addPrevisuPM() {
    if (player.PMact > 0) {
        for (let index = 0; index < document.getElementsByClassName("cell").length; index++) {
            cellTestee = document.getElementsByClassName("cell")[index];

            if (estAdjacente(player.pos(), index)
                && estVide(tabCells[index])) { cellTestee.classList.add("previsuPM"); }
        }
    }
}

function retirerToutesPrevisuPM() {
    for (let index = 0; index < document.getElementsByClassName("cell").length; index++)
        document.getElementsByClassName("cell")[index].classList.remove("previsuPM");
}


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
                cellTestee = document.getElementsByClassName("cell")[index];
                if (game.sortActif.estAPortee(player.pos(), index)
                && (!game.sortActif.LdV || isInSight(player.pos(), index))) {
                    cellTestee.classList.add("previsuSort");
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

window.onkeydown = function (event) {
    if ((event.keyCode == 27) && game.phase == "TURN_PLAYER_SPELL") {
        retirerToutesPrevisuSort();
        game.phase = "TURN_PLAYER_MOVE";
    }
    if ((event.keyCode == 32) && game.phase.includes("TURN_PLAYER")) {
        passerTourJoueur();
    }
    if ((event.keyCode == 49) && game.phase.includes("TURN_PLAYER") && player.sorts[0]) {
        previsuSort(0);
    }
    if ((event.keyCode == 50) && game.phase.includes("TURN_PLAYER") && player.sorts[1]) {
        previsuSort(1);
    }
    if ((event.keyCode == 51) && game.phase.includes("TURN_PLAYER") && player.sorts[2]) {
        previsuSort(2);
    }
    if ((event.keyCode == 52) && game.phase.includes("TURN_PLAYER") && player.sorts[3]) {
        previsuSort(3);
    }
    if ((event.keyCode == 53) && game.phase.includes("TURN_PLAYER") && player.sorts[4]) {
        previsuSort(4);
    }
    if ((event.keyCode == 54) && game.phase.includes("TURN_PLAYER") && player.sorts[5]) {
        previsuSort(5);
    }
    if ((event.keyCode == 55) && game.phase.includes("TURN_PLAYER") && player.sorts[6]) {
        previsuSort(6);
    }
    if ((event.keyCode == 56) && game.phase.includes("TURN_PLAYER") && player.sorts[7]) {
        previsuSort(7);
    }
    if ((event.keyCode == 57) && game.phase.includes("TURN_PLAYER") && player.sorts[8]) {
        previsuSort(8);
    }
    if ((event.keyCode == 58) && game.phase.includes("TURN_PLAYER") && player.sorts[9]) {
        previsuSort(9);
    }
};





