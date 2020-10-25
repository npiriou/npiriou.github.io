function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function initialisationSorts() {

    for (let i = 0; i < player.sorts.length; i++) {
        document.getElementsByClassName("sort")[i].innerHTML = (
            `<img data-toggle="tooltip" data-placement="top"  
            title="` + player.sorts[i].nom + ` ` + player.sorts[i].coutPA + ` PA" id="art" 
            src ="` + player.sorts[i].logo + `" >
            </img>`
        );
        document.getElementsByClassName("sort")[i].addEventListener("mouseover", onHoverSort);
        document.getElementsByClassName("sort")[i].classList.add("pointer");

    }
    $('[data-toggle="tooltip"]').tooltip(); // active les tooltips
}

function initialisationCellules() {
    for (let index = 0; index < 100; index++) {
        let celli = new cell(index, index % 10, Math.trunc(index / 10), null);
        tabCells.push(celli);
    }
}

function initialiserObstacles() {
    let aRefaire = 0;
    for (let i = 0; i < tabCells.length; i++) {
        if (contientEntite(tabCells[i]))
            continue;
        if (getRandomInt(5) == 0) // changer ici pour modifier le nb d'obstacles sur la map
            tabCells[i].contenu = boite.clone();
    }
    for (let i = 0; i < tabCells.length; i++) {
        if (contientEntite(tabCells[i]) && (tabCells[i].contenu.nom != "Boite")
            && (tabCells[i].contenu != player)) {
            //   on récupere les pos du joueur et du mob détecté
            let posxJ = xFromPos(player.pos());
            let posyJ = yFromPos(player.pos());

            let posx = tabCells[i].posX;
            let posy = tabCells[i].posY;

            // on trouve le chemin le plus court
            let chemin = pathfinding(posx, posy, posxJ, posyJ);

            if (chemin.length == 0) { aRefaire = 1; }
        }
    }

    if (aRefaire) {
        supprimerTousObstacles();
        initialiserObstacles();
    }
}

function supprimerTousObstacles() {
    for (let i = 0; i < tabCells.length; i++) {
        if (contientEntite(tabCells[i]) && (tabCells[i].contenu.nom == "Boite"))
            tabCells[i].contenu = null;
    }
    refreshBoard();
}

function viderBoard() {
    for (let i = 0; i < tabCells.length; i++) {
        if (tabCells[i].contenu) { delete tabCells[i].contenu; }
        tabCells[i].contenu = null;
    }
    refreshBoard();
}


function estVide(cell) {
    return (cell.contenu == null);
}
function estObstacle(cell) {
    return (cell.contenu == "OBSTACLE");
}
function contientEntite(cell) {
    if ((cell.contenu) && (typeof cell.contenu === "object")) { return true; }
    else return false;
}
function sontEnLigne(posa, posb) {
    if (xFromPos(posa) == xFromPos(posb) || yFromPos(posa) == yFromPos(posb)) return 1;
    else return 0;
}

function numeroterBoard() {
    for (let y = 0; y < 10; y++) {
        for (let index = 0; index < 10; index++) {
            let numero = index + 10 * y;
            //  document.getElementById("board").rows[y].cells[index].id = numero;
            document.getElementById("board").rows[y].cells[index].innerHTML = `<div id=${numero} class='divCell'></div>`;

        }
    }
}

function xFromPos(pos) {
    return (pos % 10);
}

function yFromPos(pos) {
    return (Math.trunc(pos / 10))
}

function posFromxy(x, y) {
    return (10 * y + x);
}
function distance(pos1, pos2) {
    let diffX = xFromPos(pos1) - xFromPos(pos2);
    let diffY = yFromPos(pos1) - yFromPos(pos2)
    let diffTotale = Math.abs(diffX) + Math.abs(diffY);
    return diffTotale;
}

function estAdjacente(pos1, pos2) {
    if (
        (xFromPos(pos1) - 1 == xFromPos(pos2) && yFromPos(pos1) == yFromPos(pos2))
        || (xFromPos(pos1) + 1 == xFromPos(pos2) && yFromPos(pos1) == yFromPos(pos2))
        || (yFromPos(pos1) - 1 == yFromPos(pos2) && xFromPos(pos1) == xFromPos(pos2))
        || (yFromPos(pos1) + 1 == yFromPos(pos2) && xFromPos(pos1) == xFromPos(pos2))
    ) {
        return 1;
    }
    else return 0;
}

function posAdjacentes(pos) {
    let posAdjs = [];
    for (let i = 0; i < tabCells.length; i++) {
        if (estAdjacente(pos, tabCells[i].posNum)) {
            posAdjs.push(tabCells[i].posNum);
        }
    }
    return posAdjs;
}

function refreshBoard() {
    for (let index = 0; index < tabCells.length; index++) {
        if (tabCells[index].contenu != null) {

            document.getElementById("board").rows[tabCells[index].posY].cells[tabCells[index].posX].children[0].innerHTML = (
                `<img id="art"class="artEntite" data-toggle="tooltip" data-placement="top"
                 src ="` + tabCells[index].contenu.skin + `" 
                 title="` + tabCells[index].contenu.nom + ` (` + tabCells[index].contenu.PVact + ` / ` + tabCells[index].contenu.PVmax + `)"
                 </img>`);


            // let img = new Image();
            // img.src = tabCells[index].contenu.skin;
            // img.classList.add("artEntite");
            // img.id = "art";
            // img.dataset.toggle = "tooltip";
            // img.dataset.placement = "top";
            // img.title = tabCells[index].contenu.nom + ` (` + tabCells[index].contenu.PVact + ` / ` + tabCells[index].contenu.PVmax + `)`;
            // document.getElementById("board").rows[tabCells[index].posY].cells[tabCells[index].posX].children[0].appendChild(img);
            // delete img;

            if (tabCells[index].contenu.side == "ALLY") {
                document.getElementById("board").rows[tabCells[index].posY].cells[tabCells[index].posX].classList.add("cellAlly");
            }
            if (tabCells[index].contenu.side == "ENEMY") {
                document.getElementById("board").rows[tabCells[index].posY].cells[tabCells[index].posX].classList.add("cellEnemy");
            }
        }
        else {
            document.getElementById("board").rows[tabCells[index].posY].cells[tabCells[index].posX].children[0].innerHTML = "";
            document.getElementById("board").rows[tabCells[index].posY].cells[tabCells[index].posX].classList.remove("cellAlly");
            document.getElementById("board").rows[tabCells[index].posY].cells[tabCells[index].posX].classList.remove("cellEnemy");
        }
    }
    $('.tooltip').remove(); //supprime toutes les tooltips affichées
    $('[data-toggle="tooltip"]').tooltip(); // refresh les tooltips

}

async function deplacerContenu(posDepart, posArrivee) {
    if (tabCells[posArrivee].contenu != null) {
        console.log("La cellule d'arrivée n'est pas vide");
        return 0;
    }
    else {
        tabCells[posArrivee].contenu = tabCells[posDepart].contenu;
        tabCells[posDepart].contenu = null;
    }
    await refreshBoard();
    await sleep(100);
    return 1;
}

function deplacerContenuInstantane(posDepart, posArrivee) {
    if (tabCells[posArrivee].contenu != null) {
        ajouterAuChatType("La cellule d'arrivée n'est pas vide", 0);

    }
    else {
        tabCells[posArrivee].contenu = tabCells[posDepart].contenu;
        tabCells[posDepart].contenu = null;
    }
    refreshBoard();
}


function trouverEntites(side) {
    let tabMobs = [];
    for (let i = 0; i < tabCells.length; i++) {
        if (tabCells[i].contenu != null) {
            if (tabCells[i].contenu.side == side) {
                tabMobs.push(tabCells[i].contenu);
            }
        }
    }
    return tabMobs;
}

function trouverInvocations(side) {
    let tabMobs = [];
    for (let i = 0; i < tabCells.length; i++) {
        if (tabCells[i].contenu != null) {
            if ((tabCells[i].contenu.side == side) && (tabCells[i].contenu.invocation == 1)) {
                tabMobs.push(tabCells[i].contenu);
            }
        }
    }
    return tabMobs;
}


////////////////////////////////////FONCTION PASSER TOUR/////////////////////////////////////////
async function passerTourJoueur() {
    if (!game.phase.includes("TURN_PLAYER")) { return; }
    sortActif = null;
    retirerToutesPrevisuSort();
    player.resetPAPM();
    await player.reduirecdSorts();
    griserOuDegriserSorts();
    refreshBoard();

    game.phase = "TURN_ALLY_INVOCATIONS";
    var tabMobs = trouverInvocations("ALLY");
    for (let i = 0; i < tabMobs.length; i++) {
        game.mobActif = tabMobs[i];
        // faire jouer chaque ia ici
        ajouterAuChatType(tabMobs[i].nom + " joue son tour.", 0);
        await game.mobActif.reduireDureeEffets();
        if (game.mobActif.PVact > 0) {
            await game.mobActif.ia();
            game.mobActif.resetPAPM();
            game.mobActif.reduirecdSorts();
        }
        game.mobActif = null;
        game.sortActif = null;
    }

    game.phase = "TURN_ENEMY";
    tabMobs = trouverEntites("ENEMY");
    // faire jouer ennemis ici
    for (let i = 0; i < tabMobs.length; i++) {
        game.mobActif = tabMobs[i];
        // faire jouer chaque ia ici
        ajouterAuChatType(tabMobs[i].nom + " joue son tour.", 0);
        await game.mobActif.reduireDureeEffets();
        if (game.mobActif.PVact > 0) {
            await game.mobActif.ia();
            game.mobActif.resetPAPM();
            game.mobActif.reduirecdSorts();
        }
        game.mobActif = null;
        game.sortActif = null;
    }
    // nouveau début de tour de joueur
    game.phase = "TURN_PLAYER_MOVE";
    player.reduireDureeEffets();
}


function griserOuDegriserSorts() {
    for (let i = 0; i < player.sorts.length; i++) {

        if ((player.sorts[i].coutPA > player.PAact) || (player.cdSorts[i] > 0)) {
            document.getElementsByClassName("sort")[i].children[0].classList.add("disabled");
        }
        if ((player.sorts[i].coutPA <= player.PAact) && (player.cdSorts[i] <= 0)) {
            document.getElementsByClassName("sort")[i].children[0].classList.remove("disabled");
        }
    }
}

function checkEndRound() {
    tabMobs = [];
    for (let i = 0; i < tabCells.length; i++) {
        if (tabCells[i].contenu != null) {
            if (tabCells[i].contenu.side == "ENEMY") {
                tabMobs.push(tabCells[i].contenu)
            }
        }
    }
    if (tabMobs.length == 0)
        winRound();
    else if (player.PVact <= 0) looseRound();
}

function winRound() {

    game.phase = "MENU";
    playerSave.PVact = copy(player.PVact); // on retient les PV du joueur comme il ne regen pas
    // player = copy(playerSave);
    player = Object.assign({}, playerSave); // on charge la derniere sauvegarde du joueur pour le cleanse
    player.resetPAPM();
    player.resetcdSorts();
    player.resetEffets();
    griserOuDegriserSorts();
    retirerToutesPrevisuSort();
    retirerToutesPrevisuPMMob();
    sortActif = null;


    viderBoard();
    game.level++;
    document.getElementById("titre").innerHTML = ("Étage " + game.level);

    randomiserBonusAffiches();
    player.afficherStatsEntite();
    $(`#modalChooseBonus`).modal({ backdrop: 'static', keyboard: false });
}

async function looseRound() {
    game.phase = "END";
    await sleep(600);
    if (confirm("Vous êtes mort")) {
        location.reload();
    } else {
        location.reload();
    }
}

function copy(a) {
    return JSON.parse(JSON.stringify(a));

}


function ajouterJoueur() {
    let randoPosPlayer = getRandomInt(20);
    tabCells[randoPosPlayer].contenu = player;
}

function newRound() {
    ajouterJoueur();

    poidsSelonLevel();
    remplirSelonPoids();

    initialiserObstacles();
    initCdSorts();

    triggerDebutCombat();
    refreshBoard();
    game.phase = "TURN_PLAYER_MOVE";
}

function sauvegarde() {
    let save = { player: player, level: game.level, effets : game.effets };
    localStorage.setItem("sauvegarde", JSON.stringify(save));
}

function charger() {
    let chargement = localStorage.getItem('sauvegarde');
    if (!chargement) return;
    chargement = JSON.parse(chargement);
    localStorage.clear();
    game.level = chargement.level;
    player.PAmax = chargement.player.PAmax;
    player.PMmax = chargement.player.PMmax;
    player.PVmax = chargement.player.PVmax;
    player.PVact = chargement.player.PVact;
    player.POBonus = chargement.player.POBonus;
    player.bonusDo = chargement.player.bonusDo;
    player.pourcentDo = chargement.player.pourcentDo;

    for (let i = 0; i < chargement.effets.length; i++) {
        let effet = listeGameEffets.filter((effet) => effet.nom == chargement.effets[i].nom)[0];
        game.effets.push(effet);
    }

    for (let i = 0; i < chargement.player.sorts.length; i++) {
        if (["CAC", "MJPOSERBOITE", "DOOM", "MJTP"].includes(chargement.player.sorts[i].code)) continue;
        let sort = listeSorts.filter((sort) => sort.code == chargement.player.sorts[i].code)[0];

        if (!sort) debugger;
        ajouterNouveauSort(listeSorts, sort);
    }
    player.resetPAPM();
    document.getElementById("titre").innerHTML = ("Étage " + game.level);

}


function randomiserBonusAffiches() {

    let boutonsBonus = document.getElementsByClassName("bouton_bonus");
    let boutonsBonusRares = document.getElementsByClassName("bouton_bonus_rare");
    let boutonsBonusClasses = document.getElementsByClassName("bouton_bonus_classe");
    let totalBonusAffiches = 3;
    let bonusRareAffiche = 0;
    // on cache tous les bonus
    for (let i = 0; i < boutonsBonus.length; i++) {
        boutonsBonus[i].style.display = 'none';
    }
    for (let i = 0; i < boutonsBonusRares.length; i++) {
        boutonsBonusRares[i].style.display = 'none';
    }
    for (let i = 0; i < boutonsBonusClasses.length; i++) {
        boutonsBonusClasses[i].style.display = 'none';
    }

    if (game.level > 1) {
        if (game.level % 5 == 1) { // tous les 5 lvl, 4 bonus rares proposés
            for (let i = 0; i < totalBonusAffiches + 1; i++) {
                let a = getRandomInt(boutonsBonusRares.length);
                if (boutonsBonusRares[a].style.display == 'none') {
                    boutonsBonusRares[a].style.display = 'block'
                }
                else { totalBonusAffiches++ }
            }
        }

        else { // lvl "normaux"
            if (getRandomInt(2) == 0) { // 1/3 d'avoir un bonus rare proposé
                boutonsBonusRares[getRandomInt(boutonsBonusRares.length)].style.display = 'block';
                bonusRareAffiche = 1;
            }
            for (let i = 0; i < totalBonusAffiches; i++) {
                let a = getRandomInt(boutonsBonus.length);
                if (boutonsBonus[a].style.display == 'none') {
                    boutonsBonus[a].style.display = 'block'
                }
                else { totalBonusAffiches++ }
            }
        }
    }
    // sinon si on est lvl 1 on a le choix entre les classes
    else for (let i = 0; i < boutonsBonusClasses.length; i++) {
        boutonsBonusClasses[i].style.display = 'block';
    }
}


function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = (box.bottom - box.top) / 2 + box.top + scrollTop - clientTop;
    var left = (box.right - box.left) / 2 + box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}


function initCdSorts() {

    for (let i = 0; i < tabCells.length; i++) {
        if (contientEntite(tabCells[i])) { tabCells[i].contenu.resetcdSorts(); }
    }
}

function isInSight(posDep, posCible, posAIgnorer = 100) { // check la Ligne de vue

    function w(e, t, n, r, posAIgnorer) {
        e = parseInt(e), t = parseInt(t);
        var o = (n = parseInt(n)) > e ? 1 : -1, a = (r = parseInt(r)) > t ? 1 : -1, s = !0, i = Math.abs(n - e), c = Math.abs(r - t), l = e, u = t, d = -1 + i + c, p = i - c; i *= 2, c *= 2;
        for (var m = 0; m < 1; m++)p > 0 ? (l += o, p -= c) : p < 0 ? (u += a, p += i) : (l += o, p -= c, u += a, p += i, d--);
        for (; d > 0 && s;)((null != tabCells[u * 10 + l].contenu) && u * 10 + l != posAIgnorer) ? s = !1 : (p > 0 ? (l += o, p -= c) : p < 0 ? (u += a, p += i) : (l += o, p -= c, u += a, p += i, d--), d--);
        return s
    }

    return w(xFromPos(posDep), yFromPos(posDep), xFromPos(posCible), yFromPos(posCible), posAIgnorer);
}

function estAPorteeDeDeplacement(posdep, posarr, pm) {
    //   on récupere les pos x et y
    let posx = xFromPos(posdep);
    let posy = yFromPos(posdep);

    let posxar = xFromPos(posarr);
    let posyar = yFromPos(posarr);

    let chemin = pathfinding(posx, posy, posxar, posyar);
    if (chemin.length != 0 && chemin.length <= pm) {
        return chemin;
    }
    else return 0;
}

slowMo = async function (chemin) {
    for (let i = 0; i < chemin.length; i++) {
        await deplacerContenu(player.pos(), posFromxy(chemin[i][0], chemin[i][1]));
        player.PMact--;

    }
    game.phase = "TURN_PLAYER_MOVE";
}

slowSort = async function (cell) {
    await cell.recevoirSort(player);
    game.phase = "TURN_PLAYER_MOVE";
}

<<<<<<< HEAD
function calculDommages(sort, Lanceur) {
    let dommagesBase = Math.floor(Math.random() * (sort.baseDmgMax - sort.baseDmgMin + 1)) + sort.baseDmgMin;
    return (Math.round(dommagesBase * ((Lanceur.pourcentDo + 100) / 100) + Lanceur.bonusDo));
}
=======

>>>>>>> 6b5b0aa83ba151ecde58152449fe2e3fb009411a

function ajouterNouveauSort(liste = listeSorts, sort = 0) {
    if (!sort) {
        if (player.sorts.length < 10) {
            let sortAAjouter = liste[Math.floor(Math.random() * liste.length)];
            if (player.aDejaSort(sortAAjouter)) {
                ajouterNouveauSort(liste, sort);
            }
            else {
                player.sorts.push(sortAAjouter);
                initialisationSorts();
                addOnClicPrevisuSort();
            }
        }
    }
    else player.sorts.push(sort);
    initialisationSorts();
    addOnClicPrevisuSort();
}

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function poidsSelonLevel() {
    game.poids = parseInt((game.level) + 1);
}

function remplirSelonPoids() {
    let poidsTerrain = 0;
    let tropDuMeme = 0;
    let randoMob;
    let randoPos;
    let bossPose = 0;
    if (game.poids >= gobpriest.poids + 10 && !listeMobs.includes(gobpriest)) { listeMobs.push(gobpriest); }


    if (game.poids == Maneki.poids) { // round du boss
        while (!bossPose) {
            randoPos = randomInteger(40, 99);
            if (!contientEntite(tabCells[randoPos])) {
                tabCells[randoPos].contenu = Maneki.clone();
                bossPose = 1;
            }
        }
    }
    else if (game.poids == gobpriest.poids) { // round du boss
        while (!bossPose) {
            randoPos = randomInteger(40, 99);
            if (!contientEntite(tabCells[randoPos])) {
                tabCells[randoPos].contenu = gobpriest.clone();
                bossPose = 1;
            }
        }
    }
    else {
        while (poidsTerrain < game.poids) {
            randoMob = getRandomInt(listeMobs.length);
            randoPos = getRandomInt(100);

            if (contientEntite(tabCells[randoPos]) || randoPos < 40 || listeMobs[randoMob].poids <= game.poids / 10) {
                continue;
            }
            else {
                tabCells[randoPos].contenu = listeMobs[randoMob].clone();
                poidsTerrain += listeMobs[randoMob].poids;
                let nBExemplaire = 0;


                for (let i = 0; i < tabCells.length; i++) {
                    if ((contientEntite(tabCells[i]) && (tabCells[i].contenu.nom == listeMobs[randoMob].nom))) {
                        nBExemplaire++;
                        if (nBExemplaire > 2) {
                            tropDuMeme = 1;
                        }
                    }
                }
            }
        }
        if ((poidsTerrain > game.poids) || tropDuMeme == 1) {
            viderBoard();
            ajouterJoueur();
            remplirSelonPoids();
        }
    }
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

async function sleep(time) {
    let a = new Promise(r => setTimeout(r, time));
    await a;
    delete a;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
async function triggerDommagesSubis(lanceur, cible) {
    for (let i = 0; i < lanceur.effets.length; i++) {
        if (lanceur.effets[i].dommagesSubis) {
            await lanceur.effets[i].dommagesSubis(cible);
        }
    }
}

function triggerDebutCombat() {
    for (let i = 0; i < game.effets.length; i++) {
        if (game.effets[i].debutCombat) {
            game.effets[i].debutCombat();
        }
    }
}