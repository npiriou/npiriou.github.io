function passifEmpoisonneurs(posCarte) {
    if (board(posCarte) != 0) {
        ajouterAuChatType(board[posCarte].nom + " est mort. ", 0);
        degatsRestants--;
        board[posCarte] = 0;
        passifGobelinExp(posCarte);
        afficherBoard(board);
    }
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





function passifFanatiquesAuto() {
    var nbRelances = 0;
    var nbDmgRel = 0;
    if (vagueActuelle.passif == "Relancent une fois les 1 et 2") {

        tabDices = document.getElementsByClassName("mob");
        for (i = 0; i < tabDices.length; i++) {
            if (tabDices[i].innerHTML == "1" || tabDices[i].innerHTML == "2") {
                tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
                nbRelances++
                if (tabDices[i].innerHTML >= vagueActuelle.resiPe) nbDmgRel++;
            }
        }
        if (nbRelances > 0) ajouterAuChatType("Les Fanatiques ont relancé " + nbRelances + " attaques et infligé " + nbDmgRel + " dégats supplémentaires.", 0)
    }
    return nbDmgRel;
}


function passifPingouinAuto() {
    var nbRelances = 0;
    var nbKillsPing = 0;
    if (checkPassifProc("PINGOUIN")) {
        tabDices = document.getElementsByClassName("per");
        for (i = 0; i < tabDices.length; i++) {
            if (tabDices[i].innerHTML == "1") {
                tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
                nbRelances++
                if (tabDices[i].innerHTML >= vagueActuelle.resiPe) nbKillsPing++;
            }
        }
        if (nbRelances > 0) ajouterAuChatType("Grâce au Pingouin vous relancez " + nbRelances + " attaques et tuez " + nbKillsPing + " des " + vagueActuelle.nom + ".", 0)
    }
    return nbKillsPing;
}
function passifDemonetteAuto() {
    var nbRelances = 0;
    var nbKillsDem = 0;
    if (checkPassifProc("DEMONETTE")) {
        tabDices = document.getElementsByClassName("dice");
        for (i = 0; i < tabDices.length; i++) {
            if (tabDices[i].innerHTML == "1") {
                tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
                nbRelances++
                if (tabDices[i].classList[1] == "tranch") {
                    if (tabDices[i].innerHTML >= vagueActuelle.resiTr) nbKillsDem++;
                }
                if (tabDices[i].classList[1] == "per") {
                    if (tabDices[i].innerHTML >= vagueActuelle.resiPe) nbKillsDem++;
                }
                if (tabDices[i].classList[1] == "mag") {
                    if (tabDices[i].innerHTML >= vagueActuelle.resiMa) nbKillsDem++;
                }
            }
        }
        if (nbRelances > 0) ajouterAuChatType("Grâce à la Demonette vous relancez " + nbRelances + " attaques et tuez " + nbKillsDem + " des " + vagueActuelle.nom + ".", 0)
    }
    return nbKillsDem;
}

function passifSeigneurAuto() {
    var nbRelances = 0;
    var nbKillsDem = 0;
    if (checkPassifProc("SEIGNEUR")) {
        tabDices = document.getElementsByClassName("dice");
        for (i = 0; i < tabDices.length; i++) {
            if (((tabDices[i].classList[1] == "tranch") && (tabDices[i].innerHTML < vagueActuelle.resiTr))
                || ((tabDices[i].classList[1] == "per") && (tabDices[i].innerHTML < vagueActuelle.resiPe))
                || ((tabDices[i].classList[1] == "mag") && (tabDices[i].innerHTML < vagueActuelle.resiMa))) {
                tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
                nbRelances++
                if (tabDices[i].classList[1] == "tranch") {
                    if (tabDices[i].innerHTML >= vagueActuelle.resiTr) nbKillsDem++;
                }
                if (tabDices[i].classList[1] == "per") {
                    if (tabDices[i].innerHTML >= vagueActuelle.resiPe) nbKillsDem++;
                }
                if (tabDices[i].classList[1] == "mag") {
                    if (tabDices[i].innerHTML >= vagueActuelle.resiMa) nbKillsDem++;
                }
            }
        }
        if (nbRelances > 0) ajouterAuChatType("Grâce au Seigneur de l'Arène vous relancez " + nbRelances + " attaques et tuez " + nbKillsDem + " des " + vagueActuelle.nom + ".", 0)
    }
    return nbKillsDem;
}

function passifForgeronAuto() {
    var nbRelances = 0;
    var nbKillsFor = 0;
    if (checkPassifProc("FORGERON")) {
        tabDices = document.getElementsByClassName("tranch");
        for (i = 0; i < tabDices.length; i++) {
            if (tabDices[i].innerHTML <= vagueActuelle.resiTr) {
                tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
                nbRelances++
                if (tabDices[i].innerHTML >= vagueActuelle.resiTr) nbKillsFor++;
            }
        }
        if (nbRelances > 0) ajouterAuChatType("Grâce au Forgeron vous relancez " + nbRelances + " attaques et tuez " + nbKillsFor + " des " + vagueActuelle.nom + ".", 0)
    }
    return nbKillsFor;
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
        if (nbMobsReste > 0) {
            ajouterAuChatType("Le Golem de Corail tue " + morts + " " + vagueActuelle.nom+".", 0);
        }
        else ajouterAuChatType("Le Golem de Corail achève les " + vagueActuelle.nom+ ".", 0);
    }
}

function passifZombie() {
    currentTabDices = document.getElementsByClassName("tranch");
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

function passifBanquier() {
    if (checkPassifProc("BANQUIER")) {
        gold++;
        ajouterAuChatType("Le Banquier a survécu et vous rapporte 1 gold.", 0);
    }
}

function passifMoine() {
    tabDices = document.getElementsByClassName("mag");

    if (checkPassifProc("MOINE")) {
        for (let i = 0; i < tabDices.length; i++) {
            if (tabDices[i].innerHTML == (vagueActuelle.resiMa - 1)) {
                tabDices[i].innerHTML = vagueActuelle.resiMa
                ajouterAuChatType("Le Moine permet de tuer un des " + vagueActuelle.nom + " .", 0)
                return 1;
            }
        }

    }

    return 0;
}

function passifDragon() {
    if (checkPassifProc("DRAGON")) {
        posCarte = checkPosPassif("DRAGON");
        board[posCarte].nbAttTr = (Math.floor(Math.random() * 6) + 1);
        if (posCarte < 4) {
            ajouterAuChatType("Le Dragon lance " + board[posCarte].nbAttTr + " attaques Tranchantes !", 0)
            afficherBoard(board);
        }
    }
}

function passifBerserker() {
    if (checkPassifProc("BERSERKER")) {
        posCarte = checkPosPassif("BERSERKER");
        board[posCarte].nbAttTr = 1 + board[posCarte].pvdep - board[posCarte].pvact;
        if (board[posCarte].nbAttTr > 1) { ajouterAuChatType("La rage du Berzerker lui octroie " + (board[posCarte].nbAttTr - 1) + " attaques supplémentaires !", 0); }
        afficherBoard(board);
    }
}


function passifMutant() {
    var killsMutant = 0;
    var tabDices = document.getElementsByClassName("tranch");
    if (checkPassifProc("MUTANT")) {
        for (i = 0; i < tabDices.length; i++) {
            if ((tabDices[i].innerHTML == 6) && (vagueActuelle.resiTr <= 6))
                killsMutant++;
        }
        if (killsMutant > 0) ajouterAuChatType("Le Mutant tue " + killsMutant + " " + vagueActuelle.nom + " de plus.", 0);

    } return killsMutant;
}

function passifMarchand() {
    if (checkPassifProc("MARCHAND")) {
        return -1;
    }
    else return 0;
}