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
    carteM1 = deck1[0];
    carteM2 = deck1[1];
    carteM3 = deck1[2];
    carteM4 = deck1[3];
    carteM5 = deck1[4];


    for (i = 0; i < 5; i++) {
        var CellMi = $("#CellM" + (i + 1))[0];
        var carteMi = deck1[i];
        CellMi.innerHTML = template.format(carteMi.tier, carteMi.nom, carteMi.nbAttTr, carteMi.nbAttPe, carteMi.nbAttMa, carteMi.pv, carteMi.pv);
    }
}
distribution();



function pickM1() { 
    carteM1 = deck1[0];
    for (i = 0; i < 8; i++) {
        if (board[i] == 0) {
            if (((carteM1.tier) * 5) <= gold) { 
                var CellBoard = $("#Cell" + (i + 1))[0];
                var CellMain = $("#CellM1")[0];
                CellBoard.innerHTML = CellMain.innerHTML;
                board[i] = carteM1;
                CellMain.innerHTML = "-";
                gold= gold - ((carteM1.tier)*5);
                $("#sectiongold")[0].innerHTML = gold + "gold";
                return 0;
            }
        }
    }

}
function pickM2() { 
    carteM2 = deck1[0];
    for (i = 0; i < 8; i++) {
        if (board[i] == 0) {
            if (((carteM2.tier) * 5) <= gold) { 
                var CellBoard = $("#Cell" + (i + 1))[0];
                var CellMain = $("#CellM2")[0];
                CellBoard.innerHTML = CellMain.innerHTML;
                board[i] = carteM2;
                CellMain.innerHTML = "-";
                gold= gold - ((carteM2.tier)*5);
                $("#sectiongold")[0].innerHTML = gold + "gold";
                return 0;
            }
        }
    }

}
function pickM3() { 
    carteM3 = deck1[0];
    for (i = 0; i < 8; i++) {
        if (board[i] == 0) {
            if (((carteM3.tier) * 5) <= gold) { 
                var CellBoard = $("#Cell" + (i + 1))[0];
                var CellMain = $("#CellM3")[0];
                CellBoard.innerHTML = CellMain.innerHTML;
                board[i] = carteM3;
                CellMain.innerHTML = "-";
                gold= gold - ((carteM3.tier)*5);
                $("#sectiongold")[0].innerHTML = gold + "gold";
                return 0;
            }
        }
    }

}
function pickM4() { 
    carteM4 = deck1[0];
    for (i = 0; i < 8; i++) {
        if (board[i] == 0) {
            if (((carteM4.tier) * 5) <= gold) { 
                var CellBoard = $("#Cell" + (i + 1))[0];
                var CellMain = $("#CellM4")[0];
                CellBoard.innerHTML = CellMain.innerHTML;
                board[i] = carteM4;
                CellMain.innerHTML = "-";
                gold= gold - ((carteM4.tier)*5);
                $("#sectiongold")[0].innerHTML = gold + "gold";
                return 0;
            }
        }
    }

}
function pickM5() { 
    carteM5 = deck1[0];
    for (i = 0; i < 8; i++) {
        if (board[i] == 0) {
            if (((carteM5.tier) * 5) <= gold) { 
                var CellBoard = $("#Cell" + (i + 1))[0];
                var CellMain = $("#CellM5")[0];
                CellBoard.innerHTML = CellMain.innerHTML;
                board[i] = carteM5;
                CellMain.innerHTML = "-";
                gold= gold - ((carteM5.tier)*5);
                $("#sectiongold")[0].innerHTML = gold + "gold";
                return 0;
            }
        }
    }

}

function boutique(){ 
    // à terminer, faut rajouter l'achat des cartes, le placement, le retour en phase de combat, etc
gold = gold + parseInt($("#nbMobsDepart").val());
distribution();
$("#sectiongold")[0].innerHTML = gold + " gold;"
}

function combat(){
    
}