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
        if (getRandomInt(4) == 0) // changer ici pour modifier le nb d'obstacles sur la map
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
            // document.getElementById("board").rows[y].cells[index].innerHTML = numero;
            document.getElementById("board").rows[y].cells[index].id = numero;
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
            document.getElementById("board").rows[tabCells[index].posY].cells[tabCells[index].posX].innerHTML = (
                `<img id="art" data-toggle="tooltip" data-placement="top"
                 src ="` + tabCells[index].contenu.skin + `" 
                 title="` + tabCells[index].contenu.nom + ` (` + tabCells[index].contenu.PVact + ` / ` + tabCells[index].contenu.PVmax + `)"
                 </img>`);
        }
        else document.getElementById("board").rows[tabCells[index].posY].cells[tabCells[index].posX].innerHTML = "";
    }
    $('.tooltip').remove(); //supprime toutes les tooltips affichées
    $('[data-toggle="tooltip"]').tooltip(); // refresh les tooltips

}

async function deplacerContenu(posDepart, posArrivee) {
    if (tabCells[posArrivee].contenu != null) {
        ajouterAuChatType("La cellule d'arrivée n'est pas vide", 0);
    }
    else {
        tabCells[posArrivee].contenu = tabCells[posDepart].contenu;
        tabCells[posDepart].contenu = null;
    }
    refreshBoard();
    await new Promise(r => setTimeout(r, 100));
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
    player.reduirecdSorts();
    griserOuDegriserSorts();
    refreshBoard();

    game.phase = "TURN_ALLY_INVOCATIONS";
    var tabMobs = trouverInvocations("ALLY");
    for (let i = 0; i < tabMobs.length; i++) {
        game.mobActif = tabMobs[i];
        // faire jouer chaque ia ici
        ajouterAuChatType(tabMobs[i].nom + " joue son tour.", 0);
        await tabMobs[i].ia();
        tabMobs[i].resetPAPM();
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
        await tabMobs[i].ia();
        tabMobs[i].resetPAPM();
        game.mobActif = null;
        game.sortActif = null;
    }

    game.phase = "TURN_PLAYER_MOVE";
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
    griserOuDegriserSorts();
    retirerToutesPrevisuSort();
    sortActif = null;


    viderBoard();
    game.level++;
    document.getElementById("titre").innerHTML = ("Étage " + game.level);

    randomiserBonusAffiches();
    player.afficherStatsEntite();
    $(`#modalChooseBonus`).modal({ backdrop: 'static', keyboard: false });
}

function looseRound() {
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
    refreshBoard();
    game.phase = "TURN_PLAYER_MOVE";
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

function splash_img(elem, imgpath) {
    let coords = getCoords(elem);
    let c = document.createElement('canvas');
    let ctx = c.getContext('2d');

    const render = (width, height, imgpath) => {
        requestAnimationFrame(() => render(width, height, imgpath));
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = ctx.opacity;
        ctx.opacity -= 0.01;
        base_image = new Image();
        base_image.src = imgpath;
        // TODO offset et size devrait etre configurable
        ctx.drawImage(base_image, 50, 50, 50, 70);

        return ctx;
    };

    c.style.position = 'absolute';
    c.style.left = coords.left - 100 + 'px';
    c.style.top = coords.top - 100 + 'px';
    c.style.pointerEvents = 'none';
    c.style.width = 200 + 'px';
    c.style.height = 200 + 'px';
    c.style.zIndex = 100;
    c.width = 200;
    c.height = 200;
    c.style.zIndex = "9999999";
    ctx.opacity = 1.0;
    document.body.appendChild(c);

    render(c.width, c.height, imgpath);
    setTimeout(() => document.body.removeChild(c), 1000);
}

function splash(elem, text) {
    {
        let coords = getCoords(elem);
        const colors = ['#ffc000', '#ff3b3b', '#ff8400'];
        const bubbles = 25;

        const explode = (x, y, text) => {
            let particles = [];
            let ratio = window.devicePixelRatio;
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');

            c.style.position = 'absolute';
            c.style.left = x - 100 + 'px';
            c.style.top = y - 100 + 'px';
            c.style.pointerEvents = 'none';
            c.style.width = 200 + 'px';
            c.style.height = 200 + 'px';
            c.style.zIndex = 100;
            c.width = 200 * ratio;
            c.height = 200 * ratio;
            c.style.zIndex = "9999999"
            ctx.textY = c.height / 2;
            document.body.appendChild(c);

            for (var i = 0; i < bubbles; i++) {
                particles.push({
                    x: c.width / 2,
                    y: c.height / 2,
                    radius: r(20, 30),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: r(0, 360, true),
                    speed: r(8, 12),
                    friction: 0.9,
                    opacity: r(0, 0.5, true),
                    yVel: 0,
                    gravity: 0.1
                });

            }

            render(particles, ctx, c.width, c.height, text);
            setTimeout(() => document.body.removeChild(c), 1000);
        };

        const render = (particles, ctx, width, height, text) => {
            requestAnimationFrame(() => render(particles, ctx, width, height, text));
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
            ctx.font = 'bold 48px serif';
            ctx.fillStyle = 'black';
            ctx.fillText(text, width / 4, ctx.textY);
            ctx.textY += height / 100;
            particles.forEach((p, i) => {
                p.x += p.speed * Math.cos(p.rotation * Math.PI / 180);
                p.y += p.speed * Math.sin(p.rotation * Math.PI / 180);

                p.opacity -= 0.01;
                p.speed *= p.friction;
                p.radius *= p.friction;
                p.yVel += p.gravity;
                p.y += p.yVel;

                if (p.opacity < 0 || p.radius < 0) return;

                ctx.beginPath();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
                ctx.fill();
            });

            return ctx;
        };

        const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
        explode(coords.left, coords.top, text);
    }
}


function splash_heal(elem, text) {
    {
        let coords = getCoords(elem);
        const colors = ['#ff4f65', '#ff5a73', '#ff5479', '#c0392b'];
        const bubbles = 15;

        const explode = (x, y, text) => {
            let particles = [];
            let ratio = window.devicePixelRatio;
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');

            c.style.position = 'absolute';
            c.style.left = x - 100 + 'px';
            c.style.top = y - 100 + 'px';
            c.style.pointerEvents = 'none';
            c.style.width = 200 + 'px';
            c.style.height = 200 + 'px';
            c.style.zIndex = 100;
            c.width = 200 * ratio;
            c.height = 200 * ratio;
            c.style.zIndex = "9999999"
            let startY = c.height * 6 / 10;
            ctx.textY = startY;
            document.body.appendChild(c);


            for (var i = 0; i < bubbles; i++) {
                particles.push({
                    x: r(c.width / 2 - c.width * 0.2, c.width / 2 + c.width * 0.2),
                    y: r(startY * 0.9, startY * 1.2),
                    radius: r(20, 40),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: r(2, 3),
                    opacity: r(0.5, 1, true),
                });

            }

            render(particles, ctx, c.width, c.height, text);
            setTimeout(() => document.body.removeChild(c), 1000);
        };

        const render = (particles, ctx, width, height, text) => {
            requestAnimationFrame(() => render(particles, ctx, width, height, text));
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
            ctx.font = 'bold 48px serif';
            ctx.fillStyle = 'black';
            ctx.fillText(text, width / 4, ctx.textY);
            ctx.textY -= height / 100;
            particles.forEach((p, i) => {
                var x = p.x;
                var y = p.y;
                var width = p.radius;
                var height = p.radius;

                p.y -= p.speed;
                //p.x += p.speed * Math.sin(p.rotation * Math.PI / 180);

                p.opacity -= 0.01;

                if (p.opacity < 0 || p.radius < 0) return;

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = p.opacity;
                var topCurveHeight = height * 0.3;
                ctx.moveTo(x, y + topCurveHeight);
                // top left curve
                ctx.bezierCurveTo(
                    x, y,
                    x - width / 2, y,
                    x - width / 2, y + topCurveHeight
                );

                // bottom left curve
                ctx.bezierCurveTo(
                    x - width / 2, y + (height + topCurveHeight) / 2,
                    x, y + (height + topCurveHeight) / 2,
                    x, y + height
                );

                // bottom right curve
                ctx.bezierCurveTo(
                    x, y + (height + topCurveHeight) / 2,
                    x + width / 2, y + (height + topCurveHeight) / 2,
                    x + width / 2, y + topCurveHeight
                );

                // top right curve
                ctx.bezierCurveTo(
                    x + width / 2, y,
                    x, y,
                    x, y + topCurveHeight
                );

                ctx.closePath();
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();

            });

            return ctx;
        };

        const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
        explode(coords.left, coords.top, text);
    }
}

function initCdSorts() {

    for (let i = 0; i < tabCells.length; i++) {
        if (contientEntite(tabCells[i])) { tabCells[i].contenu.resetcdSorts(); }
    }
}





function isInSight(posDep, posCible) { // check la Ligne de vue

    function w(e, t, n, r) {
        e = parseInt(e), t = parseInt(t);
        var o = (n = parseInt(n)) > e ? 1 : -1, a = (r = parseInt(r)) > t ? 1 : -1, s = !0, i = Math.abs(n - e), c = Math.abs(r - t), l = e, u = t, d = -1 + i + c, p = i - c; i *= 2, c *= 2;
        for (var m = 0; m < 1; m++)p > 0 ? (l += o, p -= c) : p < 0 ? (u += a, p += i) : (l += o, p -= c, u += a, p += i, d--);
        for (; d > 0 && s;)null != tabCells[u * 10 + l].contenu ? s = !1 : (p > 0 ? (l += o, p -= c) : p < 0 ? (u += a, p += i) : (l += o, p -= c, u += a, p += i, d--), d--);
        return s
    }

    return w(xFromPos(posDep), yFromPos(posDep), xFromPos(posCible), yFromPos(posCible));
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


function ajouterNouveauSort(sort = 0) {
    if (!sort) {
        if (player.sorts.length < 10) {
            let sortAAjouter = listeSorts[Math.floor(Math.random() * listeSorts.length)];
            let changerDeSort = 0;
            for (let i = 0; i < player.sorts.length; i++) {

                if (player.sorts[i] == sortAAjouter) {
                    changerDeSort = 1;
                }
            }
            if (changerDeSort == 1) {
                ajouterNouveauSort();
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

function poidsSelonLevel() {
    game.poids = parseInt((game.level) + 1);
}

function remplirSelonPoids() {
    let poidsTerrain = 0;
    let tropDuMeme = 0;

    while (poidsTerrain < game.poids) {

        let randoMob = getRandomInt(listeMobs.length);
        let randoPos = getRandomInt(100);

        if (contientEntite(tabCells[randoPos]) || randoPos < 40) {
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