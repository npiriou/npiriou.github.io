function carte(numero, tier, nom, pv, nbAttTr, nbAttPe, nbAttMa, passif) {
    this.numero = numero;
    this.tier = tier;
    this.nom = nom;
    this.pv = pv;
    this.nbAttTr = nbAttTr;
    this.nbAttPe = nbAttPe;
    this.nbAttMa = nbAttMa;
    this.passif = passif;
}

var carte1t1 = new carte(1, 1, "Spartiate", 1, 1, 1, 0, null);
var carte2t1 = new carte(2, 1, "Grosse Mite", 1, 0, 2, 0, null);
var carte3t1 = new carte(3, 1, "Croisé", 1, 1, 0, 1, null);
var carte4t1 = new carte(4, 1, "Péon", 2, 0, 1, 0, null);
var carte5t1 = new carte(5, 1, "Barbare", 1, 2, 0, 0, null);
var carte6t1 = new carte(6, 1, "Petite Tortue", 2, 0, 0, 1, null);
var carte7t1 = new carte(7, 1, "Champignon", 2, 0, 0, 1, null);
var carte8t1 = new carte(8, 1, "Nain", 2, 1, 0, 0, null);

var deck1 = [carte1t1, carte2t1, carte3t1, carte4t1, carte5t1, carte6t1, carte7t1, carte8t1];

var board = [0, 0, 0, 0, 0, 0, 0, 0];

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
Passif
</div>  </div>
<div id="carteDivision">
<div id="PVact" class="carteDivision">
{5}
</div>
/
<div id="PVdep" class="carteDivision">
{6} </div> 
</div>`;



function distribution() {
    shuffle(deck1);
    carteM1 = deck1[0];
    carteM2 = deck1[1];
    carteM3 = deck1[2];
    carteM4 = deck1[3];
    carteM5 = deck1[4];

    var status = document.getElementById("status");
    status.innerHTML = ("Achetez des cartes puis cliquez sur le bouton Paré au combat");
    $("#boutonCombat")[0].disabled=false;

    for (i = 0; i < 5; i++) {
        var CellMi = $("#CellM" + (i + 1))[0];
        var carteMi = deck1[i];
        CellMi.innerHTML = template.format(carteMi.tier, carteMi.nom, carteMi.nbAttTr, carteMi.nbAttPe, carteMi.nbAttMa, carteMi.pv, carteMi.pv);
        
        // on réactive le clic sur les cartes de la main pour pouvoir les acheter
        $("#CellM" + (i + 1))[0].onclick = (function(temp){ return function() { pickM(temp)};}) (i);
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
                CellMain.innerHTML = "-";
                gold = gold - ((carteN.tier) * 5);
                $("#sectiongold")[0].innerHTML = gold + "gold";
                $("#CellM" + (n + 1))[0].onclick = null;
                return 0;
            }
        }
    }

}


function boutique() {
    // à terminer, faut rajouter le placement, etc
    gold = gold + parseInt($("#nbMobsDepart").val());
    distribution();
    $("#sectiongold")[0].innerHTML = gold + " gold;"
}

function combat() {
    $("#boutonCombat")[0].disabled=true;
    nbTotAttTr = 0;
    nbTotAttPe = 0;
    nbTotAttMa = 0;
    for (i = 0; i < 4; i++) {
        if (board[i] != 0) {
            nbTotAttTr = nbTotAttTr + board[i].nbAttTr;
            nbTotAttPe = nbTotAttPe + board[i].nbAttPe;
            nbTotAttMa = nbTotAttMa + board[i].nbAttMa;
        }
    }
    $(".dice").remove();

    for (i = 0; i < nbTotAttTr; i++) {
        addDiceT();
    }
    for (i = 0; i < nbTotAttPe; i++) {
        addDiceP();
    }
    for (i = 0; i < nbTotAttMa; i++) {
        addDiceM();
    }
    boutonRoll.disabled = false;
}