function passifEmpoisonneurs(posCarte) {
    ajouterAuChat(board[posCarte].nom + " est mort. ");
    degatsRestants = degatsRestants - 1;
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
$( "#boutonReRollMob" )[0].style.display="none";
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
    $( "#boutonReRollMob" )[0].style.display="block";
    $( "#boutonReRollMob" )[0].disabled=false;
}
