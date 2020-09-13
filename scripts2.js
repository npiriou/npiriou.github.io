

function carte(numero, tier, nom, pvdep, pvact, nbAttTr, nbAttPe, nbAttMa, passif) {
    this.numero = numero;
    this.tier = tier;
    this.nom = nom;
    this.pvdep = pvdep;
    this.pvact = pvact;
    this.nbAttTr = nbAttTr;
    this.nbAttPe = nbAttPe;
    this.nbAttMa = nbAttMa;
    this.passif = passif;
}
var deck1 = [];
deck1[0] = new carte(1, 1, "Spartiate", 1, 1, 1, 1, 0, null);
deck1[1] = new carte(20, 5, "Yéti", 5, 5, 1, 1, 1, null);
deck1[2] = new carte(2, 1, "Grosse Mite", 1, 1, 0, 2, 0, null);
deck1[3] = new carte(3, 1, "Croisé", 1, 1, 1, 0, 1, null);
deck1[4] = new carte(4, 1, "Péon", 2, 2, 0, 1, 0, null);
deck1[5] = new carte(5, 1, "Barbare", 1, 1, 2, 0, 0, null);
deck1[6] = new carte(6, 1, "Petite Tortue", 2, 2, 0, 0, 1, null);
deck1[7] = new carte(7, 1, "Champignon", 2, 2, 0, 0, 1, null);
deck1[8] = new carte(8, 1, "Nain", 2, 2, 1, 0, 0, null);
deck1[9] = new carte(9, 1, "Magneto", 1, 1, 0, 1, 1, null);
deck1[10] = new carte(10, 1, "Barricade", 3, 3, 0, 0, 0, null);
deck1[11] = new carte(11, 2, "Bourrin", 2, 2, 1, 0, 1, null);
deck1[12] = new carte(12, 2, "Ermite", 2, 2, 0, 1, 1, null);
deck1[13] = new carte(13, 2, "Croketzor", 1, 1, 1, 1, 1, null);
deck1[14] = new carte(14, 2, "Bébé Panda", 3, 3, 0, 1, 0, null);
deck1[15] = new carte(15, 2, "Jacky", 1, 1, 1, 2, 0, null);
deck1[16] = new carte(16, 2, "Mur", 4, 4, 0, 0, 0, null);
deck1[17] = new carte(17, 4, "Sam", 1, 1, 2, 2, 1, null);
deck1[18] = new carte(18, 4, "Chevalier", 2, 2, 2, 1, 1, null);
deck1[19] = new carte(19, 4, "Panda", 6, 6, 0, 1, 0, null);



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

var template = `<div id="tier" class="bloc-Gauche">
{0}
</div>
<div id="nom" class="carteDivision">
{1}
</div> 
</div>
<div id="attaques" class="carteDivision">
{2} Tranchantes<br>
{3} Perçantes<br>
{4} Magiques<br>
<!-- Le passif viendra ici-->
</div>  </div>
<div id="carteDivision">
<div id="pvact" class="carteDivision">
{5}
</div>
/
<div id="pvdep" class="carteDivision">
{6} </div> 
</div>`;



function distribution() {
    shuffle(deck1);
    carteM1 = deck1[0];
    carteM2 = deck1[1];
    carteM3 = deck1[2];
    carteM4 = deck1[3];
    carteM5 = deck1[4];


    ajouterAuChat("Achetez des cartes puis cliquez sur le bouton Paré au combat");

    $("#boutonCombat")[0].disabled = false; // bouton Paré au combat réactivé

    // écrit les carac des cartes sur les cartes en main
    for (i = 0; i < 5; i++) {
        var CellMi = $("#CellM" + (i + 1))[0];
        var carteMi = deck1[i];
        CellMi.innerHTML = template.format(carteMi.tier, carteMi.nom, carteMi.nbAttTr, carteMi.nbAttPe, carteMi.nbAttMa, carteMi.pvact, carteMi.pvdep);

        // on réactive le clic sur les cartes de la main pour pouvoir les acheter
        $("#CellM" + (i + 1))[0].onclick = (function (temp) { return function () { pickM(temp) }; })(i);
    }
    // on réactive le clic sur les cartes du board pour les select
    for (i = 0; i < 8; i++) {
        $("#Cell" + (i + 1))[0].onclick = (function (temp1, temp2) { return function () { selectionCarteBoard(temp1, temp2) }; })(board, i);
    }
}

distribution();



function pickM(n) { // place des cartes de la main sur le board quand on clic dessus
    carteN = deck1[n];
    for (i = 0; i < 8; i++) {
        if (board[i] == 0) {
            if (((carteN.tier) * 5) <= gold) {
                var CellBoard = $("#Cell" + (i + 1))[0];
                var CellMain = $("#CellM" + (n + 1))[0];
                CellBoard.innerHTML = CellMain.innerHTML;
                board[i] = carteN;
                CellMain.innerHTML = "";
                gold = gold - ((carteN.tier) * 5);
                $("#sectiongold")[0].innerHTML = gold + "gold";
                $("#CellM" + (n + 1))[0].onclick = null;
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
        $("#Cell" + (posCarteSelect + 1))[0].style.background = "white"; posCarteSelect = null;
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


function boutique() {  // à terminer, 

    // on re desactive le bouton roll pour etre sur
    boutonRoll = document.getElementById("boutonRoll");
    boutonRoll.disabled = true;

    document.getElementById("boutonAchatLumber").disabled = false;

    // calcul des golds 
    tabDices = document.getElementsByClassName("mob");
    goldGagnes = parseFloat(vagueActuelle.nombre) - parseFloat(tabDices.length);
    if (goldGagnes < 0) { goldGagnes = 0; }
    gold = parseFloat(gold) + parseFloat(goldGagnes) + parseFloat(lumber);



    ajouterAuChat("Vague terminée. Vous gagnez " + goldGagnes + " gold des ennemis et " + lumber + " de vous ouvriers.");

    //le board revient comme avant le combat
    board = copyBoard(boardPreCombat);
    afficherBoard(board);

    for (i = 0; i < 8; i++) {
        if (board[i] != 0) {
            var Celli = $("#Cell" + (i + 1))[0];
            var cartei = board[i];
            board[i].pvact = board[i].pvdep;
            Celli.innerHTML = template.format(cartei.tier, cartei.nom, cartei.nbAttTr, cartei.nbAttPe, cartei.nbAttMa, cartei.pvdep, cartei.pvdep);
        }
    }
    // distribution des nouvelles cartes et mise a jour des gold
    distribution();
    $("#sectiongold")[0].innerHTML = gold + " gold;"

    //  on incrémente le compteur de vague et on affiche la nouvelle
    v++;
    vagueActuelle = tabVagues[v];
    displayVagueActuelle();
}

function combat() {

    // verfication du placement en frontline
    if ((board[0] == 0 || board[1] == 0 || board[2] == 0 || board[3] == 0) && (board[4] != 0 || board[5] != 0 || board[6] != 0 || board[7] != 0)) {
        ajouterAuChat("Vous devez remplir la première ligne avant de pouvoir mettre des cartes en deuxième ligne.");
    }

    else { // si le placement est autorisé

        boardPreCombat = copyBoard(board); // on save le board


        document.getElementById("boutonAchatLumber").disabled = true;
        $("#boutonCombat")[0].disabled = true; //desactivation du bouton Paré au combat

        for (i = 0; i < 5; i++) { // désactivation du clic sur les cartes de la main pour les acheter
            $("#CellM" + (i + 1))[0].onclick = null;
        }
        for (i = 0; i < 8; i++) { // désactivation du clic sur les cartes du board pour les selectionner et déplacer
            $("#Cell" + (i + 1))[0].onclick = null;
        }
        nbMobsReste = vagueActuelle.nombre;
        donnerBonsDes(); // on donne le bon nombre de dés
        boutonRoll.disabled = false; // on réactive le bouton pour lancer les dés

        var status = document.getElementById("status"); // on vide la chat box
        status.innerHTML = " ";
    }
}

function donnerBonsDes() {
    // on compte le nombre d'attaques pour mettre autant de dés
    nbTotAttTr = 0;
    nbTotAttPe = 0;
    nbTotAttMa = 0;
    for (i = 0; i < 4; i++) { // on ne compte que la frontline, c'est par ici qu'on ajoutera les ranged
        if (board[i] != 0) {
            nbTotAttTr = nbTotAttTr + board[i].nbAttTr;
            nbTotAttPe = nbTotAttPe + board[i].nbAttPe;
            nbTotAttMa = nbTotAttMa + board[i].nbAttMa;
        }
    }
    $(".dice").remove(); // on enleve les anciens dés

    // on met le bon nombre de dés

    for (i = 0; i < nbMobsReste; i++) { addDiceMob(); }
    for (i = 0; i < nbTotAttTr; i++) { addDiceT(); }
    for (i = 0; i < nbTotAttPe; i++) { addDiceP(); }
    for (i = 0; i < nbTotAttMa; i++) { addDiceM(); }

}

// Affiche Board
function afficherBoard(board) {
    // écrit les carac des cartes du board sur le board
    for (i = 0; i < 8; i++) {
        var CellMi = $("#Cell" + (i + 1))[0];
        if (board[i] != 0) {

            var carteMi = board[i];
            CellMi.innerHTML = template.format(carteMi.tier, carteMi.nom, carteMi.nbAttTr, carteMi.nbAttPe, carteMi.nbAttMa, carteMi.pvact, carteMi.pvdep);
        } else {
            CellMi.innerHTML = "Place Vide";
        }

    }
}

// Utilisez cette fonction pour copier un board    
function copyBoard(board) {
    try {
        var copy = JSON.parse(JSON.stringify(board));
    } catch (ex) {
        alert("Sagarex pose une alerte");
    }
    return copy;
}

function achatLumber() {
    if (gold >= 5) {
        lumber++;
        gold = gold - 5;
        $("#sectiongold")[0].innerHTML = gold + " gold";
        $("#sectionlumber")[0].innerHTML = lumber + "  ouvriers";
    }

}

function vente() {
    if (posCarteSelect != null) {


        $("#Cell" + (posCarteSelect + 1))[0].style.background = "white";
        gold = parseFloat(parseFloat(gold) + parseFloat(board[posCarteSelect].tier));
        $("#sectiongold")[0].innerHTML = gold + " gold";
        ajouterAuChat("Vous vendez 1 " + board[posCarteSelect].nom + " pour " + board[posCarteSelect].tier + " gold. ")
        $("#boutonVente")[0].disabled = true;

        board[posCarteSelect] = 0;
        posCarteSelect = null;
        afficherBoard(board);


    }
}