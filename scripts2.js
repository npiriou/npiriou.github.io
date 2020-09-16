

function carte(numero, tier, nom, pvdep, pvact, nbAttTr, nbAttPe, nbAttMa, passif, passifDescription) {
    this.numero = numero;
    this.tier = tier;
    this.nom = nom;
    this.pvdep = pvdep;
    this.pvact = pvact;
    this.nbAttTr = nbAttTr;
    this.nbAttPe = nbAttPe;
    this.nbAttMa = nbAttMa;
    this.passif = passif;
    this.passifDescription = passifDescription;

}
var deck1 = [];
// deck1[0] = new carte(1, 1, "Spartiate", 1, 1, 1, 1, 0, "", "");
// deck1[1] = new carte(20, 5, "Yéti", 5, 5, 1, 1, 1, "", "");
// deck1[2] = new carte(2, 1, "Grosse Mite", 1, 1, 0, 2, 0, "", "");
// deck1[3] = new carte(3, 1, "Croisé", 1, 1, 1, 0, 1, "", "");
// deck1[4] = new carte(4, 1, "Péon", 2, 2, 0, 1, 0, "", "");
// deck1[5] = new carte(5, 1, "Barbare", 1, 1, 2, 0, 0, "", "");
// deck1[6] = new carte(6, 1, "Petite Tortue", 2, 2, 0, 0, 1, "", "");
// deck1[7] = new carte(7, 1, "Champignon", 2, 2, 0, 0, 1, "", "");
// deck1[8] = new carte(8, 1, "Nain", 2, 2, 1, 0, 0, "", "");
// deck1[9] = new carte(9, 1, "Magneto", 1, 1, 0, 1, 1, "", "");
// deck1[10] = new carte(10, 1, "Barricade", 3, 3, 0, 0, 0, "", "");
// deck1[11] = new carte(11, 2, "Bourrin", 2, 2, 1, 0, 1, "", "");
// deck1[12] = new carte(12, 2, "Ermite", 2, 2, 0, 1, 1, "", "");
// deck1[13] = new carte(13, 2, "Croketzor", 1, 1, 1, 1, 1, "", "");
// deck1[14] = new carte(14, 2, "Bébé Panda", 3, 3, 0, 1, 0, "", "");
// deck1[15] = new carte(15, 2, "Jacky", 1, 1, 1, 2, 0, "", "");
// deck1[16] = new carte(16, 2, "Mur", 4, 4, 0, 0, 0, "", "");
// deck1[17] = new carte(17, 4, "Sam", 1, 1, 2, 2, 1, "", "");
// deck1[18] = new carte(18, 4, "Chevalier", 2, 2, 2, 1, 1, "", "");
// deck1[19] = new carte(19, 4, "Panda", 6, 6, 0, 1, 0, "", "");
// deck1[20] = new carte(20, 2, "Lanceur de haches", 1, 1, 2, 0, 0, "RANGED", "Attaque à distance");
// deck1[21] = new carte(21, 1, "Fée", 1, 1, 0, 0, 1, "RANGED", "Attaque à distance");
// deck1[22] = new carte(22, 2, "Mage", 1, 1, 0, 0, 2, "RANGED", "Attaque à distance");
// deck1[23] = new carte(23, 4, "Canon de Glace", 1, 1, 1, 1, 1, "RANGED", "Attaque à distance");
// deck1[24] = new carte(24, 2, "Archère Elfe", 1, 1, 0, 2, 0, "RANGED", "Attaque à distance");
deck1[25] = new carte(25, 3, "Ranger Tanker", 2, 2, 0, 2, 0, "RANGED", "Attaque à distance");
deck1[26] = new carte(26, 1, "Lanceuse de couteaux", 1, 1, 1, 0, 0, "RANGED", "Attaque à distance");
deck1[27] = new carte(27, 1, "Gobelin explosif", 1, 1, 1, 0, 0, "EXPLOSION", "Tue un ennemi quand il meurt");
deck1[28] = new carte(28, 3, "Golem de Corail", 3, 3, 1, 0, 0, "CORAIL", "Pour chaque 1 des ennemis, un meurt");
deck1[29] = new carte(29, 1, "Zombie", 1, 1, 1, 0, 0, "DAKKA", "Pour chaque 6 tranchant, lance un autre dé tranchant");
deck1[30] = new carte(30, 2, "Tréant", 2, 2, 1, 0, 0, "TREANT", "Tue un ennemi au début du combat");
deck1[31] = new carte(31, 3, "Abomination", 4, 4, 1, 0, 0, "REGEN1", "Quand vous attaquez, récupère 1 PV");
deck1[32] = new carte(32, 2, "Docteur", 1, 1, 1, 0, 0, "SOIN2", "Quand vous attaquez, soigne un allié de 2 PV");
deck1[33] = new carte(33, 3, "Mage Noir", 1, 1, 0, 0, 2, "MAGENOIR", "Ajoute un dé magique qui fait toujours 6");
deck1[34] = new carte(34, 2, "Poulpitos", 1, 1, 0, 3, 0, "", "");
deck1[35] = new carte(35, 2, "Capitaine", 1, 1, 0, 1, 0, "CAPITAINE", "Vos cartes avec 1 Perçante ou plus lancent +1 Perçante")
deck1[36] = new carte(36, 4, "Démonette", 3, 3, 0, 0, 2, "DEMONETTE", "Relancez vos jets de 1");
deck1[37] = new carte(37, 1, "Pingouin", 1, 1, 0, 1, 0, "PINGOUIN", "Relancez vos attaques perçantes de 1");
deck1[38] = new carte(38, 2, "Moine", 3, 3, 0, 0, 1, "MOINE", "Augmente un dé magique de 1");
deck1[39] = new carte(39, 3, "Dragon", 2, 2, "X", 0, 0, "DRAGON", "Lance un dé pour connaitre son nombre d'attaques");
deck1[40] = new carte(40, 3, "Mutant enragé", 2, 2, 2, 0, 0, "MUTANT", "Chaque 6 Tranchante obtenu inflige double dommages");




var board = [0, 0, 0, 0, 0, 0, 0, 0];
var boardPreCombat = board;  //servira a sauvegarder le board pour le récupérer après le combat, pour résu les morts etc

function shuffle(deck) {
    // for 1000 turns
    // switch the values of two random cards
    for (var i = 0; i < 1000; i++) {
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

shuffle(deck1);

// First, checks if it isn't implemented yet. la magie
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

var template =
    `<div id= "carteAffichee" style="max-width:205px;height:205px;min-width:150px;">
<div id="tier" class="bloc-tier">
{0}
</div>
<div id="nom" class="carteDivision"style="max-height:55px;">
{1}
</div> 

<div id="attaques" class="carteDivision" style="height:122px;">
<text id = "nbTranch" ><b>{2}</b> Tranchantes<br/></text>
<text id = "nbPer" ><b>{3}</b> Perçantes<br/></text>
<text id = "nbMag" ><b>{4}</b> Magiques<br/></text>
<p id = "passif">
<i>{7}</i>
</p>  </div>
<div id="carteDivision" style=" height:28px;">
<div id="pvact" class="carteDivision">
{5}
</div>
/
<div id="pvdep" class="carteDivision">
{6} </div> 
</div>
</div></div></div>`;

function cleanTemplate() {
    // clean des cartes du board
    var nbLigneSup = 0;
    for (i = 0; i < 8; i++) {
        var CellMi = $("#Cell" + (i + 1))[0];
        if (CellMi.children[0] != undefined) {
        if (board[i] != 0) {
            if (board[i].nbAttTr == 0) {
                var ligne = CellMi.children[0].children[2].children[0]; // la ligne a suppr
                if (ligne != undefined) {ligne.parentNode.removeChild(ligne);}
                nbLigneSup++;
            }
            if ((board[i].nbAttPe == 0)&&(CellMi.children[0].children[2].children[1-nbLigneSup])) {
                var ligne = CellMi.children[0].children[2].children[1-nbLigneSup]; // la ligne a suppr
                if (ligne != undefined) {ligne.parentNode.removeChild(ligne);}
                nbLigneSup++;
            }
            if ((board[i].nbAttMa == 0)&&(CellMi.children[0].children[2].children[2-nbLigneSup])) {
                var ligne = CellMi.children[0].children[2].children[2-nbLigneSup]; // la ligne a suppr
                if (ligne != undefined) {ligne.parentNode.removeChild(ligne);}
                
            }
        }}
        nbLigneSup=0;
    }
    // clean des cartes de la main
    var nbLigneSup = 0;
    for (i = 0; i < 5; i++) {
        var CellMi = $("#CellM" + (i + 1))[0];
        if (CellMi.children[0] != undefined) {
            if (deck1[i].nbAttTr == 0) {
                var ligne = CellMi.children[0].children[2].children[0]; // la ligne a suppr
                if (ligne != undefined) {ligne.parentNode.removeChild(ligne);}
                nbLigneSup++;
            }
            if (deck1[i].nbAttPe == 0) {
                var ligne = CellMi.children[0].children[2].children[1-nbLigneSup]; // la ligne a suppr
                if (ligne != undefined) {ligne.parentNode.removeChild(ligne);}
                nbLigneSup++;
            }
            if (deck1[i].nbAttMa == 0) {
                var ligne = CellMi.children[0].children[2].children[2-nbLigneSup]; // la ligne a suppr
                if (ligne != undefined) {ligne.parentNode.removeChild(ligne);}
                
            }
        }
        nbLigneSup=0;
    }
}

// for (let i = 15; i > 0; i--) {
//     var toutesLignesTranch = $("#nbTranch");
//     if (toutesLignesTranch[i] != undefined) {
//         if (toutesLignesTranch[i].innerHTML == 
//             "<b>0</b> Tranchantes<br>"){
//         toutesLignesTranch[i].parentNode.removeChild(toutesLignesTranch[0]);
//     }}
// }
// for (let i = 0; i < 15; i++) {
//     var toutesLignesPer = $("#nbPer");
//     if (toutesLignesPer[0] != undefined) {
//         toutesLignesPer[0].parentNode.removeChild(toutesLignesPer[0]);
//     }
// }
// for (let i = 0; i < 15; i++) {
//     var toutesLignesMag = $("#nbMag");
//     if (toutesLignesMag[0] != undefined) {
//         toutesLignesMag[0].parentNode.removeChild(toutesLignesMag[0]);
//     }
// }
// }



function distribution() {

    //on clean
    deck1 = deck1.filter(function (x) {
        return x !== undefined;
    });


    shuffle(deck1);
    carteM1 = deck1[0];
    carteM2 = deck1[1];
    carteM3 = deck1[2];
    carteM4 = deck1[3];
    carteM5 = deck1[4];

    $("#boutonCombat")[0].disabled = false; // bouton Pret au combat réactivé

    // écrit les carac des cartes sur les cartes en main
    for (i = 0; (i < 5) && (i < deck1.length); i++) {
        var CellMi = $("#CellM" + (i + 1))[0];
        var carteMi = deck1[i];
        CellMi.innerHTML = template.format(carteMi.tier, carteMi.nom, carteMi.nbAttTr, carteMi.nbAttPe, carteMi.nbAttMa, carteMi.pvact, carteMi.pvdep, carteMi.passifDescription);

        // on réactive le clic sur les cartes de la main pour pouvoir les acheter
        $("#CellM" + (i + 1))[0].onclick = (function (temp) { return function () { pickM(temp) }; })(i);
    }
    // on réactive le clic sur les cartes du board pour les select
    for (i = 0; i < 8; i++) {
        $("#Cell" + (i + 1))[0].onclick = (function (temp1, temp2) { return function () { selectionCarteBoard(temp1, temp2) }; })(board, i);
    }
     cleanTemplate()
    coloriageSelonTier();
}

distribution();



function pickM(n) { // achete et place des cartes de la main sur le board quand on clic dessus
    carteN = deck1[n];
    for (i = 0; i < board.length; i++) {
        if (board[i] == 0) { // si on a des slots libres
            if (((carteN.tier) * 5) <= gold) { // et les moyens
                var CellBoard = $("#Cell" + (i + 1))[0];
                var CellMain = $("#CellM" + (n + 1))[0];
                CellBoard.innerHTML = CellMain.innerHTML;
                board[i] = carteN;
                CellMain.innerHTML = "Carte achetée";
                gold = gold - ((carteN.tier) * 5);
                $("#sectiongold")[0].innerHTML = gold + "gold";
                $("#CellM" + (n + 1))[0].onclick = null;

                delete deck1[n];
                return 0;
            }
        }
    }

}

var posCarteSelect = null;
// selectionne les cartespour les déplacer

function selectionCarteBoard(boardA, posNouvelleCarteSelect) {
    if (posCarteSelect == null) {
        posCarteSelect = posNouvelleCarteSelect;
        $("#Cell" + (posCarteSelect + 1))[0].style.background = "blue";

        if (board[posCarteSelect] != 0) { $("#boutonVente")[0].disabled = false; }
    }
    else if (posCarteSelect != null) {
        deplacerCarteBoard(boardA, posCarteSelect, posNouvelleCarteSelect)
        $("#Cell" + (posCarteSelect + 1))[0].style.background = "beige"; posCarteSelect = null;
        $("#boutonVente")[0].disabled = true;

    }
}


function deplacerCarteBoard(boardA, posdep, posarr) {
    temp = boardA[posarr];
    boardA[posarr] = boardA[posdep];
    boardA[posdep] = temp;

    var Celldep = $("#Cell" + (posdep + 1))[0];
    var Cellarr = $("#Cell" + (posarr + 1))[0];

    temp = Cellarr.innerHTML;
    Cellarr.innerHTML = Celldep.innerHTML;
    Celldep.innerHTML = temp;
}


function boutique() {


    // on re desactive le bouton roll pour etre sur
    boutonRoll = document.getElementById("boutonRoll");
    boutonRoll.disabled = true;

    $("#boutonreRollBoutiqueFree")[0].style.display = "none";
    $("#boutonreRollBoutique2G")[0].style.display = "block";
    $("#boutonreRollBoutique2G")[0].disabled = false;
    $("#boutonreRollBoutiqueFree")[0].disabled = false;

    if (lumber < 10) { document.getElementById("boutonAchatLumber").disabled = false; }




    // ajout des leak
    leakTotal = leakTotal + nbMobsReste;
    $("#sectionleak")[0].innerHTML = leakTotal + " leak";




    // calcul des golds 
    tabDices = document.getElementsByClassName("mob");
    if (vagueActuelle.passif == "Lancent deux attaques par Boss") { goldGagnes = parseInt(vagueActuelle.nombre) - (parseInt(tabDices.length) / 2); }
    else {
        goldGagnes = parseFloat(vagueActuelle.nombre) - nbMobsReste;
    }
    if (goldGagnes < 0) { goldGagnes = 0; }
    gold = parseFloat(gold) + parseFloat(goldGagnes) + parseFloat(lumber);


    // ajout du score
    scoreTotal = scoreTotal + parseInt(goldGagnes) - nbMobsReste + parseInt(lumber);
    $("#sectionscore")[0].innerHTML = "Score : " + scoreTotal;


    ajouterAuChatType("Vague terminée. Vous gagnez " + goldGagnes + " gold des ennemis et " + lumber + " de vos ouvriers.", 0);

    //le board revient comme avant le combat
    board = copyBoard(boardPreCombat);
    afficherBoard(board);

    for (i = 0; i < 8; i++) {
        if (board[i] != 0) {
            var Celli = $("#Cell" + (i + 1))[0];
            var cartei = board[i];
            board[i].pvact = board[i].pvdep;
            Celli.innerHTML = template.format(cartei.tier, cartei.nom, cartei.nbAttTr, cartei.nbAttPe, cartei.nbAttMa, cartei.pvdep, cartei.pvdep, cartei.passifDescription);
        }
    }
    ajouterAuChatType("Quand vous êtes prêts, cliquez sur le bouton Prêt.", 1);

    // distribution des nouvelles cartes et mise a jour des gold
    distribution();
    $("#sectiongold")[0].innerHTML = gold + " gold;"

    //  on incrémente le compteur de vague et on affiche la nouvelle
    v++;
    if (v>=16) victoire();
    vagueActuelle = tabVagues[v];
    displayVagueActuelle();

    donnerBonsDes("joueur");
}

function combat() { // se déclenche quand j'appuie sur le bouton Pret

    $("#boutonreRollBoutique2G")[0].disabled = true;
    $("#boutonreRollBoutiqueFree")[0].disabled = true;

    // verfication du placement en frontline
    if ((board[0] == 0 || board[1] == 0 || board[2] == 0 || board[3] == 0) && (board[4] != 0 || board[5] != 0 || board[6] != 0 || board[7] != 0)) {
        ajouterAuChatType("Vous devez remplir la première ligne avant de pouvoir mettre des cartes en deuxième ligne.", 1);
    }

    else { // si le placement est autorisé

        boardPreCombat = copyBoard(board); // on save le board


        document.getElementById("boutonAchatLumber").disabled = true;
        $("#boutonCombat")[0].disabled = true; //desactivation du bouton Pret

        for (i = 0; i < 5; i++) { // désactivation du clic sur les cartes de la main pour les acheter
            $("#CellM" + (i + 1))[0].onclick = null;
        }
        for (i = 0; i < 8; i++) { // désactivation du clic sur les cartes du board pour les selectionner et déplacer
            $("#Cell" + (i + 1))[0].onclick = null;
        }
        nbMobsReste = vagueActuelle.nombre;
        donnerBonsDes(); // on donne le bon nombre de dés
        document.getElementById("status").innerHTML = " "; // on vide la chat box

        passifTreant();

        if (vagueActuelle.passif == "Attaquent en premier") { boutonRollMob.disabled = false; }
        else {
            boutonRoll.disabled = false; // on réactive le bouton pour lancer les dés
        }

    }
}

function donnerBonsDes(quelDes = "tous") {
    if ((quelDes == "tous") || quelDes == "joueur") {
        // on compte le nombre d'attaques pour mettre autant de dés
        nbTotAttTr = 0;
        nbTotAttPe = 0;
        nbTotAttMa = 0;
        for (i = 0; i < 4; i++) { // on ne compte que la frontline
            if (board[i] != 0) {
               if(board[i].nbAttTr != "X") nbTotAttTr += board[i].nbAttTr;
                nbTotAttPe += board[i].nbAttPe;
                nbTotAttMa += board[i].nbAttMa;
            }
        }
        for (i = 4; i < 8; i++) { // on ne compte que les ranged en backline
            if ((board[i] != 0) && board[i].passif == "RANGED") {
                nbTotAttTr += board[i].nbAttTr;
                nbTotAttPe += board[i].nbAttPe;
                nbTotAttMa += board[i].nbAttMa;
            }
        }

        nbTotAttPe += passifCapitaine();

        $(".dice").remove(); // on enleve les anciens dés
        for (i = 0; i < nbTotAttTr; i++) { addDiceT(); }  // on met le bon nombre de dés
        for (i = 0; i < nbTotAttPe; i++) { addDiceP(); }
        for (i = 0; i < nbTotAttMa; i++) { addDiceM(); }
    }

    if ((quelDes == "tous") || quelDes == "mobs") {
        $(".dicemob").remove(); // on enleve les anciens dés

        // on met le bon nombre de dés
        if (vagueActuelle.passif == "Lancent deux attaques par Boss") { passifBoss2emeAtt(); }
        else { for (i = 0; i < nbMobsReste; i++) { addDiceMob(); } }
    }



}

// Affiche Board
function afficherBoard(board) {
    // écrit les carac des cartes du board sur le board
    for (i = 0; i < 8; i++) {
        var CellMi = $("#Cell" + (i + 1))[0];
        if (board[i] != 0) {

            var carteMi = board[i];
            CellMi.innerHTML = template.format(carteMi.tier, carteMi.nom, carteMi.nbAttTr, carteMi.nbAttPe, carteMi.nbAttMa, carteMi.pvact, carteMi.pvdep, carteMi.passifDescription);
        } else {
            CellMi.innerHTML = "Place Vide";
        }
    }
    cleanTemplate()
    coloriageSelonTier();
}

// Utilisez cette fonction pour copier un board    
function copyBoard(board) {
    return JSON.parse(JSON.stringify(board));

}

function achatLumber() {
    if (gold >= 5) {
        lumber++;
        gold = gold - 5;
        $("#sectiongold")[0].innerHTML = gold + " gold";
        $("#sectionlumber")[0].innerHTML = lumber + "  ouvriers";
        if (lumber >= 10) { $("#boutonAchatLumber")[0].disabled = true; ajouterAuChatType("Vous avez le maximum d'ouvriers.", 1) }
    }

}

function vente() {
    if (posCarteSelect != null) {


        $("#Cell" + (posCarteSelect + 1))[0].style.background = "beige";
        gold = parseFloat(parseFloat(gold) + parseFloat(board[posCarteSelect].tier));
        $("#sectiongold")[0].innerHTML = gold + " gold";
        ajouterAuChatType("Vous vendez 1 " + board[posCarteSelect].nom + " pour " + board[posCarteSelect].tier + " gold. ", 0)
        $("#boutonVente")[0].disabled = true;

        board[posCarteSelect] = 0;
        posCarteSelect = null;
        afficherBoard(board);


    }
}

function reRollBoutiqueFree() {
    distribution();
    $("#boutonreRollBoutiqueFree")[0].style.display = "none";
    $("#boutonreRollBoutique2G")[0].style.display = "block";

}

function reRollBoutique2G() {
    if (gold >= 2) {
        distribution();
        gold = parseInt(gold) - 2;
        $("#sectiongold")[0].innerHTML = gold + " gold";
    }
}

function compterMobsMorts() {
    nbMobsReste = nbMobsReste - killCount; if (nbMobsReste < 0) { nbMobsReste = 0; }
    ajouterAuChatType("Vous tuez " + killCount + " " + vagueActuelle.nom + ". Il en reste " + nbMobsReste + ".", 0);
    reponseDesMonstres();
}

function coloriageSelonTier() {
    tabtiers = $(".bloc-tier");
    for (i = 0; i < tabtiers.length; i++) {
        tabtiers[i].style.background = "green";
        if (tabtiers[i].innerHTML == "\n1\n") { tabtiers[i].style.background = "#CD853F"; }
        if (tabtiers[i].innerHTML == "\n2\n") { tabtiers[i].style.background = "#DDA0DD"; }
        if (tabtiers[i].innerHTML == "\n3\n") { tabtiers[i].style.background = "#7B68EE"; }
        if (tabtiers[i].innerHTML == "\n4\n") { tabtiers[i].style.background = "#F0FFFF"; }
        if (tabtiers[i].innerHTML == "\n5\n") { tabtiers[i].style.background = "#FF0000"; }

    }
}




