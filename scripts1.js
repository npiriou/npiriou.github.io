function vague(numero, nom, resiTr, resiPe, resiMa, precision, nombre, passif) {
	this.numero = numero;
	this.nom = nom;
	this.resiTr = resiTr;
	this.resiPe = resiPe;
	this.resiMa = resiMa;
	this.precision = precision;
	this.nombre = nombre;
	this.passif = passif;
}

var tabVagues = [];
tabVagues[0] = new vague(1, "Crabes", 2, 3, 2, 5, 5, "");
tabVagues[1] = new vague(2, "Loups", 3, 3, 2, 5, 6, "");
tabVagues[2] = new vague(3, "Serpents vicieux", 5, 4, 3, 3, 4, "");
tabVagues[3] = new vague(4, "Trolls", 4, 4, 5, 4, 8, "");
tabVagues[4] = new vague(5, "Aigles", 6, 2, 5, 4, 7, "");
tabVagues[5] = new vague(6, "Assassins", 5, 6, 4, 2, 6, "");
tabVagues[6] = new vague(7, "Raptors", 3, 3, 3, 3, 9, "Attaquent en premier");
tabVagues[7] = new vague(8, "Empoisonneurs", 4, 5, 999, 3, 6, "Tuent en un coup");
tabVagues[8] = new vague(9, "Golems", 5, 6, 3, 4, 12, "");
tabVagues[9] = new vague(10, "Boss", 999, 6, 6, 2, 6, "Lancent deux attaques par Boss");
tabVagues[10] = new vague(11, "Centaures", 3, 5, 4, 4, 15, "");
tabVagues[11] = new vague(12, "Fanatiques", 3, 5, 5, 3, 12, "Relancent une fois les 1 et 2");
tabVagues[12] = new vague(13, "Voleurs", 3, 5, 4, 4, 15, "Volent 1 gold à chaque attaque qui touche");
tabVagues[13] = new vague(14, "Ptérodactyles", 6, 2, 4, 2, 10, "Attaquent en premier");
tabVagues[14] = new vague(15, "Ethérés", 999, 999, 4, 2, 10, "");
tabVagues[15] = new vague(16, "Mammouths", 6, 6, 6, 4, 15, "");

var lumber = 0;
var v = 0;
var vagueActuelle = tabVagues[v];

function displayVagueActuelle() {

	status2 = document.getElementById("status2");
	status2.innerHTML = ("Vague " + ((vagueActuelle.numero)) + " : " + vagueActuelle.nom + "<br>"
		+ (vagueActuelle.nombre) + " ennemis au départ.<br>"
		+ "Précision des ennemis :<br/>" + vagueActuelle.precision + " ou plus.<br>"
		+ vagueActuelle.passif + "<br>Résistances :"
	);

	if (vagueActuelle.resiTr < 900) { $((".tranchaff"))[0].innerHTML = (vagueActuelle.resiTr + "+") }
	else { $((".tranchaff"))[0].innerHTML = "∞" }

	if (vagueActuelle.resiPe < 900) { $((".peraff"))[0].innerHTML = (vagueActuelle.resiPe + "+") }
	else { $((".peraff"))[0].innerHTML = "∞" }

	if (vagueActuelle.resiMa < 900) { $((".magaff"))[0].innerHTML = (vagueActuelle.resiMa + "+") }
	else { $((".magaff"))[0].innerHTML = "∞" }
}
displayVagueActuelle();


//initialisation
var status = document.getElementById("status");
let newP = document.createElement('p');

var nbMobsReste = vagueActuelle.nombre;
var nbMobsTourPrec = vagueActuelle.nombre;
var gold = 20;
var degatsRestants = null;
var leakTotal = 0;
var scoreTotal = 0;
var killCount = 0;

// désactivation des boutons pour le jeu par vagues
$(':input').prop('disabled', true);
var boutonCombat = document.getElementById("boutonCombat");
boutonCombat.disabled = false;
var boutonAchatLumber = document.getElementById("boutonAchatLumber");
boutonAchatLumber.disabled = false;
$("#boutonreRollBoutiqueFree")[0].disabled = false;
$("#boutonreRollBoutique2G")[0].disabled = false;
$("#mainContainer")[0].hidden=true;

// on cache les boutons re roll
$("#boutonreRollBoutique2G")[0].style.display = "none";

// desactive les boutons pour roll les dés
var tour = "joueur";
var boutonRoll = document.getElementById("boutonRoll");
var boutonRollMob = document.getElementById("boutonRollMob");
boutonRollMob.disabled = true;
boutonRollMob.hidden = true;
boutonRoll.hidden = true;
$("#boutonVente")[0].hidden = true;

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
	var elem = document.getElementById("partr");
	elem.insertAdjacentElement('afterend', newDiv);
	return newDiv;
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
	return newDiv;
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
	return newDiv;
}
function addDiceMob() {
	// create a new div element 
	const newDiv = document.createElement("div");
	newDiv.classList.add("dicemob");
	newDiv.classList.add("mob");
	// and give it some content 
	const newContent = document.createTextNode("0");
	// add the text node to the newly created div
	newDiv.appendChild(newContent);
	// add the newly created element and its content into the DOM 
	var bouton = document.getElementById("parmob");
	bouton.insertAdjacentElement('afterend', newDiv);
	return newDiv;
}

function advRoll() {


	passifRegen();
	passifSoin2();
	passifDragon();
	passifBerserker();
	donnerBonsDes("joueur"); // on réactualise le  nombre de dés

	killCount = 0;

	var tabDices = document.getElementsByClassName("tranch");
	for (i = 0; i < tabDices.length; i++) {
		tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
	}
	for (i = 0; i < tabDices.length; i++) {
		if (tabDices[i].innerHTML >= vagueActuelle.resiTr) killCount++;
	}



	tabDices = document.getElementsByClassName("per");
	for (i = 0; i < tabDices.length; i++) {
		tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
	}
	for (i = 0; i < tabDices.length; i++) {
		if (tabDices[i].innerHTML >= vagueActuelle.resiPe) killCount++;
	}
	killCount += passifPingouinAuto();

	tabDices = document.getElementsByClassName("mag");
	for (i = 0; i < tabDices.length; i++) {
		tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
	}

	for (i = 0; i < tabDices.length; i++) {
		if (tabDices[i].innerHTML >= vagueActuelle.resiMa) killCount++;
	}

	killCount += passifMageNoir();
	killCount += passifDemonetteAuto();
	killCount += passifForgeronAuto();
	killCount += passifSeigneurAuto();


	killCount += passifMoine();
	killCount += passifZombie();
	killCount += passifMutant();


	compterMobsMorts();

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
	boutonRollMob.hidden = true;

	donnerBonsDes("mobs"); // on donne le bon nombre de dés aux mobs


	// on roll les dés et calcule les dégats infligés
	var degatsInfliges = 0;
	tabDices = document.getElementsByClassName("mob");
	for (i = 0; i < tabDices.length; i++) {
		tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1); //genere un chiffre dans le html directement
		if (tabDices[i].innerHTML >= vagueActuelle.precision) degatsInfliges++;
	}


	degatsInfliges += passifFanatiquesAuto();



	passifGolemCorail();
	if (degatsInfliges>0) ajouterAuChatType("Les " + vagueActuelle.nom + " attaquent ! Vous perdez " + degatsInfliges + " PV ! ", 0);
else ajouterAuChatType("Les " + vagueActuelle.nom + " ratent leur attaque ! ", 0);
	degatsRestants = degatsInfliges;
	repartitionDegats();




	if (vagueActuelle.passif == ("Volent 1 gold à chaque attaque qui touche")) {
		ajouterAuChatType("Les " + vagueActuelle.nom + " vous volent " + degatsInfliges + " gold !", 0)
		gold = parseInt(gold) - parseInt(degatsInfliges);
		if (gold < 0) { gold = 0; }
		$("#sectiongold")[0].innerHTML = gold + " gold";
	}

}
function repartitionDegats() {
	var ilyaeuunmort = false;

	// si le board est vide OU si tous les ennemis sont morts, la vague se termine
	if ((boardVide(board))||(nbMobsReste == 0)) {
		degatsRestants = 0;
		tour = "boutique";
		var boutonRoll = document.getElementById("boutonRoll");
		boutonRoll.disabled = true;
		boutonRoll.hidden = true;
		boutonRollMob.disabled = true;
		boutonRollMob.hidden = true;
		boutique();

	} else {



		//tant qu'il reste des pv a repartir ET qu'il reste au moins une tour en front line	
		if ((degatsRestants > 0) && (board[0] != 0 || board[1] != 0 || board[2] != 0 || board[3] != 0)) {

			// les dégats partent en premier sur les cartes blessées
			for (i = 0; i < 4; i++) {
				if (board[i].pvact < board[i].pvdep) {
					carteBlessee = i;
					selectionPVPerdu(i);
					ilyaeuunmort = true;
					return;
				}
			}
			//si apres la repartition auto il reste des pv a repartir ET qu'il reste au moins une tour en front line	
			if ((degatsRestants > 0)
				&& (board[0] != 0 || board[1] != 0 || board[2] != 0 || board[3] != 0)
				&& (!ilyaeuunmort)) {

				ajouterAuChatType("Il reste " + (degatsRestants) + " PV perdus à répartir.", 0);
				ajouterAuChatType(" Sélectionnez une carte en première ligne. ", 1);

				//on active le clic sur les cartes en frontline pour les select
				for (i = 0; i < 4; i++) {
					if (board[i] != 0) { 
					$("#Cell" + (i + 1))[0].onclick = (function (temp2) { return function () { selectionPVPerdu(temp2) }; })(i);
				}
			}
		}
	}
		else {
		if ((board[0] == 0 && board[1] == 0 && board[2] == 0 && board[3] == 0) && (degatsRestants > 0)) {
			degatsRestants = 0; ajouterAuChatType("La première ligne s'est faite massacrer !", 0)
		}

		// si la frontline a une place et que il ya des cartes en backline, elles doivent avancer
		if ((board[0] == 0 || board[1] == 0 || board[2] == 0 || board[3] == 0)
			&& (board[4] != 0 || board[5] != 0 || board[6] != 0 || board[7] != 0)) {
			backlineAvance();
		}
		else {
			var tour = "joueur";

			for (i = 0; i < 8; i++) { // désactivation du clic sur les cartes du board pour les selectionner et déplacer
				$("#Cell" + (i + 1))[0].onclick = null;
			}
			var boutonRoll = document.getElementById("boutonRoll");
			boutonRoll.disabled = false;
			boutonRoll.hidden = false;

			return;
		}
	}
}
}


function selectionPVPerdu(posCarte) {

	if (vagueActuelle.passif == "Tuent en un coup") {
		passifEmpoisonneurs(posCarte);
		repartitionDegats();
	}

	else if (board[posCarte].pvact <= degatsRestants) { // plus de degats que de pv, la carte meurt

		ajouterAuChatType(board[posCarte].nom + " est mort. ", 0);
		passifGobelinExp(posCarte);
		degatsRestants = degatsRestants - board[posCarte].pvact;
		board[posCarte] = 0;
		$("#Cell"+(posCarte+1))[0].style.background = "url('pool_table.png')";
		afficherBoard(board);
		repartitionDegats();
	}
	else if (board[posCarte].pvact > degatsRestants) { // plus de pv que de dégats, la carte tanke
		board[posCarte].pvact = board[posCarte].pvact - degatsRestants;
		ajouterAuChatType(board[posCarte].nom + " survit avec " + board[posCarte].pvact + " PV !", 0);
		// var Celli = $("#Cell" + (posCarte + 1))[0];
		// var carteMi = board[posCarte];

		afficherBoard(board);// Celli.innerHTML = template.format(carteMi.tier, carteMi.nom, carteMi.nbAttTr, carteMi.nbAttPe, carteMi.nbAttMa, carteMi.pvact, carteMi.pvdep, carteMi.passifDescription);
		degatsRestants = 0;
		repartitionDegats();
	}
}

function reponseDesMonstres() {

	tabDicesMob = document.getElementsByClassName("mob");
	nbDesMobs = tabDicesMob.length;
	nbDesMobsASuppr = nbDesMobs - nbMobsReste;

	donnerBonsDes("mobs");

	nbMobsTourPrec = nbMobsReste;
	nbDesMobs = tabDicesMob.length;

	if (nbMobsReste > 0) {
		tour = "ennemi";
		boutonRoll.disabled = true;
		boutonRoll.hidden = true;

		boutonRollMob.disabled = false;
		boutonRollMob.hidden = false;


	}
	else {
		tour = "boutique";
		boutonRoll.disabled = true;
		boutonRoll.hidden = true;

		boutonRollMob.disabled = true;
		boutonRollMob.hidden = true;
		boutique();
	}
}


// return vrai si le board est vide, faux sinon
function boardVide(board) {
	for (i = 0; i < 8; i++) {
		if (board[i] != 0) return false;
	}
	return true;
}

function backlineAvance() {

	ajouterAuChatType("Faites avancer votre backline", 1);

	// on réactive le clic sur les cartes du board pour les select
	for (i = 0; i < 8; i++) {
		$("#Cell" + (i + 1))[0].onclick = (function (temp2) { return function () { selectionCarteBack(temp2) }; })(i);
	}

}
function selectionCarteBack(posNouvelleCarteSelect) {
	if ((posCarteSelect == null) && (posNouvelleCarteSelect > 3) && board[posNouvelleCarteSelect] != 0) {
		posCarteSelect = posNouvelleCarteSelect;
		$("#Cell" + (posCarteSelect + 1))[0].style.background = "blue";
	}

	// pour changer la sélection en cas d'erreur
	else if ((posCarteSelect != null) && (posNouvelleCarteSelect >= 4) && board[posNouvelleCarteSelect] != 0) {
		$("#Cell" + (posCarteSelect + 1))[0].style.background = "url('cream_dust.png')";
		posCarteSelect = posNouvelleCarteSelect;
		$("#Cell" + (posCarteSelect + 1))[0].style.background = "blue";
	}

	else if ((posCarteSelect != null) && (posNouvelleCarteSelect < 4) && board[posNouvelleCarteSelect] == 0) {
		deplacerCarteBoard(board, posCarteSelect, posNouvelleCarteSelect)
		if (board[posCarteSelect] == 0) { $("#Cell" + (posCarteSelect + 1))[0].style.background = "url('pool_table.png')"; }
        if (board[posCarteSelect] != 0) { $("#Cell" + (posCarteSelect + 1))[0].style.background = "url('cream_dust.png')"; }
		if (board[posNouvelleCarteSelect] == 0) { $("#Cell" + (posNouvelleCarteSelect + 1))[0].style.background = "url('pool_table.png')"; }		
		if (board[posNouvelleCarteSelect] != 0) { $("#Cell" + (posNouvelleCarteSelect + 1))[0].style.background = "url('cream_dust.png')"; }		

		posCarteSelect = null;
		repartitionDegats();
	}
}

function ajouterAuChat(ecriture) {
	var status = document.getElementById("status");
	var statusenrobage = document.getElementById("statusenrobage");

	var t = document.createElement('p');
	t.innerText = ecriture;
	t.style.color = "green"


	status.appendChild(t);

	//descend la scrolleuse
	statusenrobage.scrollTop = statusenrobage.scrollHeight;

}

function ajouterAuChatType(ecriture, type) {
	var status = document.getElementById("status");
	var statusenrobage = document.getElementById("statusenrobage");

	var t = document.createElement('p');
	t.innerText = ecriture;

	if (type == 0) //description
	{
		t.style.fontStyle = "italic"
		t.style.color = "#006600"
	}

	if (type == 1) //injonction
	{
		t.style.fontStyle = "bold"
		t.style.color = "#800000"
	}



	status.appendChild(t);

	//descend la scrolleuse
	statusenrobage.scrollTop = statusenrobage.scrollHeight;

}

function victoire() {
	var nbMobsTotal = 0;
	for (let index = 0; index < tabVagues.length; index++) {
		nbMobsTotal += tabVagues[index].nombre;
	}

	var grind = nbMobsTotal - leakTotal;
	if (leakTotal == 0) alert("Félicitations ! Partie PARFAITE ! Votre score final est de " + scoreTotal + ".");
	else {
		alert("Félicitations ! Vous avez grindé " + grind + " monstres. Votre score final est de " + scoreTotal + ". Essaye de moins leak la prochaine fois ;)")
	}
}

function shadowBlue(cell, boardOuMain, pos) {
	if (boardOuMain == 'main') {
		if (deck1[pos] != undefined) {
			document.getElementById(cell).style.boxShadow = "1px 1px 15px  yellow";
			document.getElementById(cell).style.cursor = "pointer";
		}
	}
	else if (boardOuMain == 'board') {
		if ((board[pos] != undefined && board[pos] != 0) || posCarteSelect != null) {
			document.getElementById(cell).style.boxShadow = "1px 1px 15px  yellow";
			document.getElementById(cell).style.cursor = "pointer";
		}
	}
}

function noShadow(cell, boardOuMain, pos) { // trigger quand on enleve la souris, enleve l'ombre
	if (boardOuMain == 'main') {

		document.getElementById(cell).style.boxShadow = "0 0 0 white";
	}
	else if (boardOuMain == 'board') {

		document.getElementById(cell).style.boxShadow = "0 0 0 white";

	}
}

function mainDesactivee() {
	for (i = 0; i < $(".carteM").length; i++) {
		$(".carteM")[i].style.cursor = "not-allowed";
		$(".carteM")[i].onmouseover = null;
	}
	$("#handContainer")[0].style.cursor = "not-allowed";
}

function mainActive() {
	for (i = 0; i < $(".carteM").length; i++) {
		$(".carteM")[i].style.cursor = "auto";
		$(".carteM")[i].onmouseover = (function (temp1, temp2, temp3) { return function () { shadowBlue(temp1, temp2, temp3) }; })("CellM" + (i + 1), "main", i);
		//	$(".carteM")[i].onmouseover = null;
	}
	$("#handContainer")[0].style.cursor = "auto";
}

