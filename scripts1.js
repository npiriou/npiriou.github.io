//initialisation
var nbMobsReste = $("#nbMobsDepart").val();
var nbMobsTourPrec = $("#nbMobsDepart").val();
var gold = 20;


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
		if (tabDices[i].innerHTML >= document.getElementById("resiTr").value) killCount++;;
	}

	tabDices = document.getElementsByClassName("per");
	for (i = 0; i < tabDices.length; i++) {
		tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
		if (tabDices[i].innerHTML >= document.getElementById("resiPe").value) killCount++;;
	}

	tabDices = document.getElementsByClassName("mag");
	for (i = 0; i < tabDices.length; i++) {
		tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
		if (tabDices[i].innerHTML >= document.getElementById("resiMa").value) killCount++;;
	}
	var elemNbMobsDepart = document.getElementById("nbMobsDepart");
	nbMobsReste = nbMobsReste - killCount; if (nbMobsReste < 0) { nbMobsReste = 0; }

	var status = document.getElementById("status");
	status.innerHTML = "Vous tuez " + killCount + " monstres. Il en reste " + nbMobsReste + ".";


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
	var degatsInfliges = 0;
	tabDices = document.getElementsByClassName("mob");
	for (i = 0; i < tabDices.length; i++) {
		tabDices[i].innerHTML = (Math.floor(Math.random() * 6) + 1);
		if (tabDices[i].innerHTML >= document.getElementById("mobPrecision").value) degatsInfliges++;
	}

	var status2 = document.getElementById("status");
	status2.innerHTML = "Vous perdez " + degatsInfliges + " points de vie !";
	var tour = "joueur";
	var boutonRoll = document.getElementById("boutonRoll");
	boutonRoll.disabled = false;
	boutonRollMob.disabled = true;


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
		console.log("le cbt continue");

	}
	else {
		console.log("fin du combat");
		tour = "boutique";
		boutonRoll.disabled = true;
		boutonRollMob.disabled = true;
		boutique();
	}
}


