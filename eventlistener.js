function addOnClic() {
    for (let index = 0; index < document.getElementsByClassName("cell").length; index++) {
        document.getElementsByClassName("cell")[index].addEventListener("click", cellCliqued);
    }

    $(`#modalChooseBonus`).on('hidden.bs.modal', function () {
        // quand la modal d'entre deux round se ferme, on envoie un nouveau round
        newRound();
    });

}

function cellCliqued() {
    switch (game.phase) {
        case "TURN_PLAYER_MOVE":
            game.sortActif = null;


            if (estVide(tabCells[this.id])) {
                let chemin = estAPorteeDeDeplacement(player.pos(), this.id, player.PMact);
                if (chemin) {
                    game.phase = "SLOWMO_PLAYER";
                    slowMo(chemin);
                }
            }
            break;
        case "TURN_PLAYER_SPELL":

            if (!game.sortActif.estAPortee(player.pos(), this.id, player.POBonus)
                || (game.sortActif.LdV && !isInSight(player.pos(), this.id))) { //si la case cliquée n'est pas à portée du sort
                retirerToutesPrevisuSort();                          // on désélectione le sort
                game.sortActif = null;
                console.log("sort pas a portee");
            }
            else {                                                   // si le clic est sur une case à portée
                retirerToutesPrevisuSort();               
                player.mettreSortEnCd();
                player.retirerPASort();
                tabCells[this.id].recevoirSort(player);
                game.sortActif = null;
            }
            if (game.phase == "TURN_PLAYER_SPELL") { // si on est toujours en phase de sort, donc que le round 
                game.phase = "TURN_PLAYER_MOVE";  // n'est pas terminé, on passe en MOVE, sinon on reste en MENU
            }
            break;
    }
}


function onClickBonus(bouton) {

    switch (bouton.id) {
        case "buttonDo": player.bonusDo += 1;
            break;
        case "buttonPourcentDo": player.pourcentDo += 10;
            break;
        case "buttonPVmax": player.PVmax += 10; player.PVact += 10;
            break;
        case "buttonHeal": player.PVact = player.PVmax;
            break;
        case "buttonPA": player.PAmax++; player.PAact++;
            break;
        case "buttonPM": player.PMmax++; player.PMact++;
            break;
        case "buttonPO": player.PO++;
            break;
        case "buttonNouveauSort": ajouterNouveauSort();

            break;
    }
   // playerSave = copy(player);
    playerSave = Object.assign({}, player);
}

