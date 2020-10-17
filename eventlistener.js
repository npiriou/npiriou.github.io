function addOnClic() {
    for (let index = 0; index < document.getElementsByClassName("cell").length; index++) {
        celli = document.getElementsByClassName("cell")[index];
        document.getElementsByClassName("cell")[index].addEventListener("click", cellCliqued);
    }
}

function cellCliqued() {
    switch (game.phase) {
        case "TURN_PLAYER_MOVE":
            game.sortActif = null;
            if (estAdjacente(player.pos(), this.id)
                && estVide(tabCells[this.id])
                && (player.PMact > 0)) {
                player.PMact--
                deplacerContenu(player.pos(), this.id);

            }
            break;
        case "TURN_PLAYER_SPELL":

            if (!game.sortActif.estAPortee(player.pos(), this.id)
                || (game.sortActif.LdV && !isInSight(player.pos(), this.id))) { //si la case cliquée n'est pas à portée du sort
                retirerToutesPrevisuSort();                          // on désélectione le sort
                game.sortActif = null;
                console.log("sort pas a portee");
            }
            else {                                                   // si le clic est sur une case à portée
                if (tabCells[this.id].contenu == null) {                    // si la case est vide      
                    //tabCells[this.id].recevoirSort();
                    console.log("voilà des PA bien gachés");
                    splash(this, "");
                }
                else {                                                      // si il y a une entité sur la case    
                    tabCells[this.id].contenu.recevoirSort(player.bonusDo, player.pourcentDo); 
                }
                retirerToutesPrevisuSort();
                player.retirerPASort();
                player.mettreSortEnCd();
                game.sortActif = null;
            }
            game.phase = "TURN_PLAYER_MOVE";
            break;
    }
}


