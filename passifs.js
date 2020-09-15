function passifEmpoisonneurs(posCarte) {
    ajouterAuChatType(board[posCarte].nom + " est mort. ", 0);
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
    passifGolemCorail();
    ajouterAuChatType("Les " + vagueActuelle.nom + " attaquent ! Vous perdez " + degatsInfliges + " PV ! ", 0);

    degatsRestants = degatsInfliges;
    repartitionDegats();
}




function passifFanatiquesAddBouton() {

    if (vagueActuelle.passif == "Relancent une fois les 1 et 2") {
        $("#boutonReRollMob")[0].style.display = "block";
        $("#boutonReRollMob")[0].disabled = false;
    }
}
function auMoinsUn1(string){
    var auMoinsUn1 = false;
    var tabDices = document.getElementsByClassName(string);
    for (let i = 0; i < tabDices.length; i++) {
        if (tabDices[i].innerHTML == 1) { var auMoinsUn1 = true; }
    }
    return auMoinsUn1;
}

function passifDemonetteAddBouton() {
    if (checkPassifProc("DEMONETTE")) {
        if (auMoinsUn1("dice")) {
            boutonRoll.disabled = true;
            $("#boutonReRoll1s")[0].style.display = "block";
            $("#boutonReRoll1s")[0].disabled = false;
        }
    }
    else {
        $("#boutonReRoll1s")[0].style.display = "none";
    }
}

function passifDemonette() {
    // on cache le bouton re roll
    $("#boutonReRoll1s")[0].style.display = "none";

    var tabDices = document.getElementsByClassName("tranch");
    for (i = 0; i < tabDices.length; i++) {
        if (tabDices[i].innerHTML == 1) {
            tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
            if (tabDices[i].innerHTML >= vagueActuelle.resiTr) killCount++;
        }
    }
    tabDices = document.getElementsByClassName("per");
    for (i = 0; i < tabDices.length; i++) {
        if (tabDices[i].innerHTML == 1) {
            tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
            if (tabDices[i].innerHTML >= vagueActuelle.resiTr) killCount++;
        }
    }
    tabDices = document.getElementsByClassName("mag");
    for (i = 0; i < tabDices.length; i++) {
        if (tabDices[i].innerHTML == 1) {
            tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
            if (tabDices[i].innerHTML >= vagueActuelle.resiTr) killCount++;
        }
    }
demonette = false;
compterMobsMorts();
}


function passifPingouinAddBouton() {
    if (checkPassifProc("PINGOUIN")) {
        if (auMoinsUn1("per")) {
            boutonRoll.disabled = true;
            $("#boutonReRoll1Percantes")[0].style.display = "block";
            $("#boutonReRoll1Percantes")[0].disabled = false;
        }
    }
    else {
        $("#boutonReRoll1Percantes")[0].style.display = "none";
    }
}


function passifPingouin() {
    // on cache le bouton re roll
    $("#boutonReRoll1Percantes")[0].style.display = "none";

    tabDices = document.getElementsByClassName("per");
    for (i = 0; i < tabDices.length; i++) {
        if (tabDices[i].innerHTML == 1) {
            tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
            if (tabDices[i].innerHTML >= vagueActuelle.resiTr) killCount++;
        }
    }
pingouin = false;
compterMobsMorts();
}




function passifGobelinExp(posCarte) {
    if (board[posCarte].passif == "EXPLOSION") {
        nbMobsReste--; donnerBonsDes("mobs");
        ajouterAuChatType("Le gobelin tue un ennemi en mourrant.", 0)
    }

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
        ajouterAuChatType("Le Golem de Corail tue " + morts + " " + vagueActuelle.nom, 0);
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
            if (roll >= vagueActuelle.resiTr) nbKillsZombie++;
            // edit html
            div.innerHTML = roll;

        }

    }
    if (nbKillsZombie > 0) ajouterAuChatType("Le Zombie tue " + nbKillsZombie + " " + vagueActuelle.nom + " de plus", 0);
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

function checkPosPassif(passifACheck) {
    for (let index = 0; index < board.length; index++) {
        if (board[index].passif == passifACheck) {
            return index;
        }
    }
    console.log(passifACheck + " n'a pas été trouvé"); return false;
}

function passifTreant() {
    if (checkPassifProc("TREANT")) {
        nbMobsReste--; donnerBonsDes("mobs");
        ajouterAuChatType("Le tréant élimine un des " + vagueActuelle.nom + " .", 0)
    }

}

function passifRegen() {
    if (checkPassifProc("REGEN1")) {
        posCarte = checkPosPassif("REGEN1");
        if (board[posCarte].pvact < board[posCarte].pvdep) {
            board[posCarte].pvact++;
            afficherBoard(board);
            ajouterAuChatType(board[posCarte].nom + " récupère 1 PV.", 0)
        }
    }
}

function passifSoin2() {
    if (checkPassifProc("SOIN2")) {
        posBlesse = null;
        for (let index = 0; index < board.length; index++) {
            if (board[index].pvact < board[index].pvdep) {
                posBlesse = index;
                difference = board[index].pvdep - board[index].pvact;
                if (difference > 2) { difference = 2; }

            }
        }

        if (posBlesse != null) {
            board[posBlesse].pvact = difference + board[posBlesse].pvact;
            afficherBoard(board);
            ajouterAuChatType("Le Docteur rend " + difference + " PV à " + board[posBlesse].nom, 0)
        }
    }
}

function passifMageNoir() {
    var nbKillsMageNoir = 0;
    if (checkPassifProc("MAGENOIR")) {

        const newDiv = document.createElement("div");
        newDiv.classList.add("dice");
        newDiv.classList.add("mag");
        newDiv.classList.add("magenoir");
        const newContent = document.createTextNode("6");
        newDiv.appendChild(newContent);
        var bouton = document.getElementById("parma");
        bouton.insertAdjacentElement('afterend', newDiv);
        if (vagueActuelle.resiMa <= 6) nbKillsMageNoir++;
    }
    return nbKillsMageNoir;
}

function passifCapitaine() {
    var attSuppCapitaine = 0;
    if (checkPassifProc("CAPITAINE")) {

        for (i = 0; i < 4; i++) { // on ne compte que la frontline
            if (board[i] != 0) {
                if (nbTotAttPe > 0) {
                    attSuppCapitaine++
                }

            }
        }
        for (i = 4; i < 8; i++) { // on ne compte que les ranged en backline
            if ((board[i] != 0) && board[i].passif == "RANGED") {
                if (nbTotAttPe > 0) {
                    attSuppCapitaine++
                }
            }
        }
    }
    return attSuppCapitaine;
}