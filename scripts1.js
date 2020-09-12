function vague(numero, nom, resiTr, resiPe, resiMa, precision, nombre) {
	this.numero = numero;
	this.nom = nom;
	this.resiTr = resiTr;
	this.resiPe = resiPe;
	this.resiMa = resiMa;
	this.precision = precision;
	this.nombre = nombre;
}
var vague0 = new vague(0, "Crabes", 2, 3, 2, 5, 5);
var vague1 = new vague(1, "Loups", 3, 3, 2, 5, 6);
var vague2 = new vague(2, "Serpents vicieux", 5, 4, 3, 3, 4);
var vague3 = new vague(3, "Trolls", 4, 4, 5, 4, 8);
var vague4 = new vague(4, "Aigles", 6, 2, 5, 4, 7);

var tabVagues = [vague0, vague1, vague2, vague3, vague4];
var v = 0;
var vagueActuelle = tabVagues[v];

function displayVagueActuelle() {
	status2 = document.getElementById("status2");
	status2.innerHTML = ("Vague " + ((vagueActuelle.numero) + 1) + " : " + vagueActuelle.nom + "<br>"
		+ (vagueActuelle.nombre) + " ennemis au départ.<br>"
		+ "Résistances au attaques Tranchantes : " + vagueActuelle.resiTr + " ou plus.<br>"
		+ "Résistances au attaques Perçantes : " + vagueActuelle.resiPe + " ou plus.<br>"
		+ "Résistances au attaques Magiques : " + vagueActuelle.resiMa + " ou plus.<br>"
		+ "Précision des ennemis : " + vagueActuelle.precision + " ou plus.<br>"
	);
}
displayVagueActuelle();


//initialisation
var nbMobsReste = vagueActuelle.nombre;
var nbMobsTourPrec = vagueActuelle.nombre;
var gold = 20;
var degatsRestants = null;


// désactivation des boutons pour le jeu par vagues
$(':input').prop('disabled', true);
var boutonCombat = document.getElementById("boutonCombat");
boutonCombat.disabled = false;

// desactive le bouton pour roll les mobs
var tour = "joueur";
var boutonRoll = document.getElementById("boutonRoll");
var boutonRollMob = document.getElementById("boutonRollMob");
boutonRollMob.disabled = true;

// delete des vieux mobs
tabDicesMob = document.getElementsByClassName("mob");
nbDesMobs = tabDicesMob.length;
for (i = 0; i < nbDesMobs; i++) {
	tabDicesMob[0].remove();

}

// ajout des nouveaux mobs
for (i = 0; i < nbMobsReste; i++) {
	addDiceMob();
}



// fonction d'initialisation
function init() {

	nbMobsReste = $("#nbMobsDepart").val();
	var nbMobsTourPrec = $("#nbMobsDepart").val();

	// desactive le bouton pour roll les mobs
	var tour = "joueur";
	var boutonRollMob = document.getElementById("boutonRollMob");
	boutonRollMob.disabled = true;

	// delete des vieux mobs
	tabDicesMob = document.getElementsByClassName("mob");
	nbDesMobs = tabDicesMob.length;
	for (i = 0; i < nbDesMobs; i++) {
		tabDicesMob[0].remove();

	}
	// ajout des nouveaux mobs
	for (i = 0; i < nbMobsReste; i++) {
		addDiceMob();
	}
}


function addDiceT() {
	// create a new div element 
	const newDiv = document.createElement("div");
	newDiv.classList.add("dice");
	newDiv.classList.add("tranch");
	// and give it some content 
	const newContent = document.createTextNode("0");
	// add the text node to the newly created div
	newDiv.appendChild(newContent);
	// add the newly created element and its content into the DOM 
	var bouton = document.getElementById("partr");
	bouton.insertAdjacentElement('afterend', newDiv);
}
function addDiceP() {
	// create a new div element 
	const newDiv = document.createElement("div");
	newDiv.classList.add("dice");
	newDiv.classList.add("per");
	// and give it some content 
	const newContent = document.createTextNode("0");
	// add the text node to the newly created div
	newDiv.appendChild(newContent);
	// add the newly created element and its content into the DOM 
	var bouton = document.getElementById("parpe");
	bouton.insertAdjacentElement('afterend', newDiv);
}
function addDiceM() {
	// create a new div element 
	const newDiv = document.createElement("div");
	newDiv.classList.add("dice");
	newDiv.classList.add("mag");
	// and give it some content 
	const newContent = document.createTextNode("0");
	// add the text node to the newly created div
	newDiv.appendChild(newContent);
	// add the newly created element and its content into the DOM 
	var bouton = document.getElementById("parma");
	bouton.insertAdjacentElement('afterend', newDiv);
}
function addDiceMob() {
	// create a new div element 
	const newDiv = document.createElement("div");
	newDiv.classList.add("dice");
	newDiv.classList.add("mob");
	// and give it some content 
	const newContent = document.createTextNode("0");
	// add the text node to the newly created div
	newDiv.appendChild(newContent);
	// add the newly created element and its content into the DOM 
	var bouton = document.getElementById("parmob");
	bouton.insertAdjacentElement('afterend', newDiv);
}

function advRoll() {
	var killCount = 0;

	var tabDices = document.getElementsByClassName("tranch");
	for (i = 0; i < tabDices.length; i++) {
		tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
		if (tabDices[i].innerHTML >= vagueActuelle.resiTr) killCount++;;
	}

	tabDices = document.getElementsByClassName("per");
	for (i = 0; i < tabDices.length; i++) {
		tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
		if (tabDices[i].innerHTML >= vagueActuelle.resiPe) killCount++;;
	}

	tabDices = document.getElementsByClassName("mag");
	for (i = 0; i < tabDices.length; i++) {
		tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
		if (tabDices[i].innerHTML >= vagueActuelle.resiMa) killCount++;;
	}
	nbMobsReste = nbMobsReste - killCount; if (nbMobsReste < 0) { nbMobsReste = 0; }

	var status = document.getElementById("status");
	let newP = document.createElement('p');
	status.append(newP, "Vous tuez " + killCount + " monstres. Il en reste " + nbMobsReste + ".");


	reponseDesMonstres();
}

function removeDiceT() {
	var tabDices = document.getElementsByClassName("tranch");
	tabDices[0].remove();
}
function removeDiceP() {
	var tabDices = document.getElementsByClassName("per");
	tabDices[0].remove();
}
function removeDiceM() {
	var tabDices = document.getElementsByClassName("mag");
	tabDices[0].remove();
}

function rollMob() {

	boutonRollMob.disabled = true;

	// on roll les dés et calcule les dégats infligés
	var degatsInfliges = 0;
	tabDices = document.getElementsByClassName("mob");
	for (i = 0; i < tabDices.length; i++) {
		tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
		if (tabDices[i].innerHTML >= vagueActuelle.precision) degatsInfliges++;
	}

	var status = document.getElementById("status");
	let newP = document.createElement('p');
	status.append(newP, "Les ennemis attaquent ! Vous perdez " + degatsInfliges + " PV ! ");

	degatsRestants = degatsInfliges;
	repartitionDegats();

}



// 	while ((board[0] != 0 ||board[1] != 0 || board[2] != 0 || board[3] != 0)){

// 	if (degatsRestants > 0) {
// 		status.append(newP, "Il reste " + (degatsRestants) + " PV perdus à répartir. Sélectionnez une carte en première ligne. ");

// 		// on active le clic sur les cartes du board pour les select
// 		for (i = 0; i < 4; i++) {
// 			$("#Cell" + (i + 1))[0].onclick = (function (temp1, temp2, temp3) { return function () { selectionPVPerdu(temp1, temp2, temp3) }; })(board, i, degatsInfliges);
// 		}
// 	}
// 	if (degatsRestants <= 0) {
// 		for (i = 0; i < 8; i++) { // désactivation du clic sur les cartes du board
// 			$("#Cell" + (i + 1))[0].onclick = null;
// 		}	
// 		break;
// 	}
// }
// }
function repartitionDegats() {
	 if(boardVide(board)){
		degatsRestants = 0;
	tour = "boutique";
		var boutonRoll = document.getElementById("boutonRoll");
		boutonRoll.disabled = true;
		boutonRollMob.disabled = true;		
		boutique();}
	//tant qu'il reste des pv a repartir ET qu'il reste au moins une tour en front line
	
	if ((degatsRestants > 0) && (board[0] != 0 || board[1] != 0 || board[2] != 0 || board[3] != 0)) {


		var status = document.getElementById("status");
		let newP = document.createElement('p');
		status.append(newP, "Il reste " + (degatsRestants) + " PV perdus à répartir. Sélectionnez une carte en première ligne. ");

		//on active le clic sur les cartes en frontline pour les select
		for (i = 0; i < 4; i++) {
			$("#Cell" + (i + 1))[0].onclick = (function (temp2) { return function () { selectionPVPerdu(temp2) }; })(i);
		}
	}
	else {
		var tour = "joueur";
		var boutonRoll = document.getElementById("boutonRoll");
		boutonRoll.disabled = false;
		return;
	}
	
}


function selectionPVPerdu(posCarte) {

	var status = document.getElementById("status");
	let newP = document.createElement('p');

	if (board[posCarte].pvact <= degatsRestants) { // plus de degats que de pv, la carte meurt
		status.append(newP, board[posCarte].nom + " est mort");
			 
		 var Celli = $("#Cell" + (posCarte + 1))[0];	
		 var carteMi = board[posCarte];
		 Celli.innerHTML = "Place Vide";
		// conclusion
		degatsRestants = degatsRestants - board[posCarte].pvact;
		board[posCarte] = 0;
		repartitionDegats();
	}
	else if (board[posCarte].pvact > degatsRestants) { // plus de pv que de dégats, la carte tanke
		board[posCarte].pvact = board[posCarte].pvact - degatsRestants;
		status.append(newP, board[posCarte].nom + " survit avec " + board[posCarte].pvact + " PV !");
		 var Celli = $("#Cell" + (posCarte + 1))[0];
		 var carteMi = board[posCarte];
		 Celli.innerHTML = template.format(carteMi.tier, carteMi.nom, carteMi.nbAttTr, carteMi.nbAttPe, carteMi.nbAttMa, carteMi.pvact, carteMi.pvdep);
		degatsRestants = 0;
		repartitionDegats();
	}
}

function reponseDesMonstres() {

	tabDicesMob = document.getElementsByClassName("mob");
	nbDesMobs = tabDicesMob.length;
	nbDesMobsASuppr = nbDesMobs - nbMobsReste;

	for (i = 0; i < nbDesMobsASuppr; i++) {
		tabDicesMob[0].remove();
	}

	

	nbMobsTourPrec = nbMobsReste;
	nbDesMobs = tabDicesMob.length;

	if (nbMobsReste > 0) {
		tour = "ennemi";
		boutonRoll.disabled = true;
		boutonRollMob.disabled = false;

	}
	else {
		tour = "boutique";
		boutonRoll.disabled = true;
		boutonRollMob.disabled = true;
		boutique();
	}
}


// return vrai si le board est vide, faux sinon
function boardVide(board){
	for (i = 0; i < 8; i++) {
		if((board[i]!= 0)) return false;
	}
  return true;
}