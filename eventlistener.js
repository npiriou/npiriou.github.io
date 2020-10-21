function addOnClic() {
    for (let index = 0; index < document.getElementsByClassName("cell").length; index++) {
        document.getElementsByClassName("cell")[index].children[0].addEventListener("click", cellCliqued);
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
        case "buttonPourcentDo": player.pourcentDo += 15;
            break;
        case "buttonPVmax": player.PVmax += 10; player.PVact += 10;
            break;
        case "buttonHeal": player.PVact = player.PVmax;
            break;
        case "buttonPA": player.PAmax++; player.PAact++;
            break;
        case "buttonPM": player.PMmax++; player.PMact++;
            break;
        case "buttonPO": player.POBonus++;
            break;
        case "buttonNouveauSort": ajouterNouveauSort();
            break;
        case "buttonGuerrier": ajouterNouveauSort(pression); player.PVmax += 20; player.PVact += 20;
            break;
        case "buttonMage": ajouterNouveauSort(fireball); player.pourcentDo += 30;
            break;
        case "buttonCostaud": ajouterNouveauSort(gifle); player.bonusDo += 2;
            break;
        case "buttonLache": ajouterNouveauSort(invoquerOgre); player.PMmax++; player.PMact++;
            break;
        case "buttonChatteux": ajouterNouveauSort(diceThrow);
            let random = getRandomInt(6);
            if (random == 0) { player.bonusDo += 1; }
            if (random == 1) { player.pourcentDo += 15; }
            if (random == 2) { player.PVmax += 10; player.PVact += 10; }
            if (random == 3) { player.PAmax++; player.PAact++; }
            if (random == 4) { player.PMmax++; player.PMact++; }
            if (random == 5) { player.POBonus++; }
            random = getRandomInt(6);
            if (random == 0) { player.bonusDo += 1; }
            if (random == 1) { player.pourcentDo += 15; }
            if (random == 2) { player.PVmax += 10; player.PVact += 10; }
            if (random == 3) { player.PAmax++; player.PAact++; }
            if (random == 4) { player.PMmax++; player.PMact++; }
            if (random == 5) { player.POBonus++; }
            ajouterAuChatType("Le Chatteux est un malin, il jette un oeil à ses stats pour voir quel bonus il a gagné.", 0);
            break;
    }
    player.afficherStatsEntite();

    // playerSave = copy(player);
    playerSave = Object.assign({}, player);
}

