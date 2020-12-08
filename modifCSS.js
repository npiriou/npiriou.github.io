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
                    if (game.sortActif.AoE === 'Croix') { 
                    cellboiteee.classList.add("previsuSortCroix");
                }}
            }

        }
    }
}


function retirerToutesPrevisuSort() {
    for (let index = 0; index < document.getElementsByClassName("cell").length; index++) {
        document.getElementsByClassName("cell")[index].classList.remove("previsuSort");
        document.getElementsByClassName("cell")[index].classList.remove("previsuSortCroix");
    }
}
function retirerToutesPrevisuPMMob() {
    for (let index = 0; index < document.getElementsByClassName("cell").length; index++) {
        document.getElementsByClassName("cell")[index].classList.remove("previsuPMMob");
    }
}


function addHoverCell() {
    for (let index = 0; index < document.getElementsByClassName("cell").length; index++) {
        //if (contientEntite(tabCells[index]) && (tabCells[index].contenu.nom != "Tonneau")) {
        document.getElementsByClassName("cell")[index].children[0].addEventListener("mouseover", onHoverCell);
        document.getElementsByClassName("cell")[index].children[0].addEventListener("mouseout", onMouseOutOfCell);
    }
}
function onHoverCell() {
    if (contientEntite(tabCells[this.id]) && tabCells[this.id].contenu.nom != "Tonneau") {
        tabCells[this.id].contenu.afficherStatsEntite();
        tabCells[this.id].contenu.afficherPrevisuPMMob();
    }
    else if (estVide(tabCells[this.id])) {
        if (game.phase != "TURN_PLAYER_MOVE") { return; }
        let chemin = estAPorteeDeDeplacement(player.pos(), this.id, player.PMact);
        if (chemin) {
            for (let i = 0; i < chemin.length; i++) {
                document.getElementsByClassName("cell")[posFromxy(chemin[i][0], chemin[i][1])].classList.add("previsuPMPlusieurs");
            }
        }
    }
}

function onMouseOutOfCell() {
    for (let index = 0; index < document.getElementsByClassName("cell").length; index++) {
        document.getElementsByClassName("cell")[index].classList.remove("previsuPMPlusieurs");
    }
    retirerToutesPrevisuPMMob();
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
    if (((event.keyCode == 65) || (event.keyCode == 49)) && game.phase.includes("TURN_PLAYER") && player.sorts[0]) {
        previsuSort(0);
    }
    if (((event.keyCode == 90) || (event.keyCode == 50)) && game.phase.includes("TURN_PLAYER") && player.sorts[1]) {
        previsuSort(1);
    }
    if (((event.keyCode == 69) || (event.keyCode == 51)) && game.phase.includes("TURN_PLAYER") && player.sorts[2]) {
        previsuSort(2);
    }
    if (((event.keyCode == 82) || (event.keyCode == 52)) && game.phase.includes("TURN_PLAYER") && player.sorts[3]) {
        previsuSort(3);
    }
    if (((event.keyCode == 84) || (event.keyCode == 53)) && game.phase.includes("TURN_PLAYER") && player.sorts[4]) {
        previsuSort(4);
    }
    if (((event.keyCode == 89) || (event.keyCode == 54)) && game.phase.includes("TURN_PLAYER") && player.sorts[5]) {
        previsuSort(5);
    }
    if (((event.keyCode == 85) || (event.keyCode == 55)) && game.phase.includes("TURN_PLAYER") && player.sorts[6]) {
        previsuSort(6);
    }
    if (((event.keyCode == 73) || (event.keyCode == 56)) && game.phase.includes("TURN_PLAYER") && player.sorts[7]) {
        previsuSort(7);
    }
    if (((event.keyCode == 79) || (event.keyCode == 57)) && game.phase.includes("TURN_PLAYER") && player.sorts[8]) {
        previsuSort(8);
    }
    if (((event.keyCode == 80) || (event.keyCode == 58)) && game.phase.includes("TURN_PLAYER") && player.sorts[9]) {
        previsuSort(9);
    }
};

window.addEventListener('keydown', function (e) { // empeche le scrolling quand on tape espace
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
});

document.addEventListener('contextmenu', event => {
    event.preventDefault();
    retirerToutesPrevisuSort();
    game.phase = "TURN_PLAYER_MOVE";
});


$("body").swipe({
    //Generic swipe handler for all directions
    swipeRight: function () {
        passerTourJoueur();
    }
});