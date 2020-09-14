function passifEmpoisonneurs(posCarte) {
    ajouterAuChat(board[posCarte].nom + " est mort. ");
    degatsRestants--;
    board[posCarte] = 0;

    afficherBoard(board);
}

function passifBoss2emeAtt() {
    for (i = 0; i < (2 * nbMobsReste); i++) { addDiceMob(); }
}

function relance(resultatMin, resultatDe) {
    if (resultatDe < resultatMin) {
        return (Math.floor(Math.random() * 6) + 1);
    }
    else return resultatDe;
}

function passifFanatiquesRelance() {

    // on cache le bouton re roll
    $("#boutonReRollMob")[0].style.display = "none";
    var degatsInfliges = 0;


    for (i = 0; i < tabDices.length; i++) {

        tabDices[i].innerHTML = relance(vagueActuelle.precision, tabDices[i].innerHTML);

        if (tabDices[i].innerHTML >= vagueActuelle.precision) degatsInfliges++;
    }
    ajouterAuChat("Les " + vagueActuelle.nom + " attaquent ! Vous perdez " + degatsInfliges + " PV ! ");

    degatsRestants = degatsInfliges;
    repartitionDegats();



}


function passifFanatiquesAddBouton() {

    if (vagueActuelle.passif == "Relancent une fois les 1 et 2") {
        $("#boutonReRollMob")[0].style.display = "block";
        $("#boutonReRollMob")[0].disabled = false;
    }
}

function passifGobelinExp(posCarte) {
    if (board[posCarte].passif == "EXPLOSION") { nbMobsReste--; donnerBonsDes(); ajouterAuChat("Le gobelin tue un ennemi en mourrant.") }

}


function passifGolemCorail() {
    var morts = 0;

    if (checkPassifProc("CORAIL")) {
        tabDicesMob = document.getElementsByClassName("mob");

        for (let i = 0; i < tabDicesMob.length; i++) {
            if (tabDicesMob[i].innerHTML == "1") {
                nbMobsReste--; morts++;
            }
        }
    }
    if (morts > 0) {
        ajouterAuChat("Le Golem de Corail tue " + morts + " " + vagueActuelle.nom);
    }
}

function passifZombie(currentTabDices) {
    var nbKillsZombie = 0;
    if (checkPassifProc("DAKKA")) {

        var nbNouveauDe = 0;
        for (let index = 0; index < currentTabDices.length; index++) {
            if (currentTabDices[index].innerHTML == "6") {
                nbNouveauDe++;
            }

        }

        var div;
        for (let i = 0; i < nbNouveauDe; i++) {
            //print
            div = addDiceT()
            //roll
            roll = Math.floor(Math.random() * 6) + 1;
            //killcount
            if (roll>=vagueActuelle.resiTr) nbKillsZombie++;
            // edit html
            div.innerHTML = roll;

        }

    }
    if (nbKillsZombie > 0) ajouterAuChat("Le Zombie tue " + nbKillsZombie + " "+vagueActuelle.nom+" de plus");
    return nbKillsZombie;
}

function checkPassifProc(passifACheck) {
    for (let index = 0; index < board.length; index++) {
        if (board[index].passif == passifACheck) {
            return true;
        }
    }
    return false;

}