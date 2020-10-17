
function initialisationSorts() {

    for (let i = 0; i < player.sorts.length; i++) {
        document.getElementsByClassName("sort")[i].innerHTML = (
            `<img data-toggle="tooltip" data-placement="top"  
            title="` + player.sorts[i].nom + ` ` + player.sorts[i].coutPA + ` PA" id="art" 
            src ="` + player.sorts[i].logo + `" >
            </img>`
        );
    }
    $('[data-toggle="tooltip"]').tooltip(); // active les tooltips
}

function initialisationCellules() {

    for (let index = 0; index < 100; index++) {
        celli = new cell(index, index % 10, Math.trunc(index / 10), null);
        tabCells.push(celli);
    }
}

function initialiserObstacles() {
    aRefaire = 0;
    for (let i = 0; i < tabCells.length; i++) {
        if (contientEntite(tabCells[i]))
            continue;
        if (getRandomInt(4) == 0)
            tabCells[i].contenu = test.clone();
    }
    for (let i = 0; i < tabCells.length; i++) {
        if (contientEntite(tabCells[i]) && (tabCells[i].contenu.nom != "test")
            && (tabCells[i].contenu != player)) {
            //   on récupere les pos du joueur et du mob détecté
            posxJ = xFromPos(player.pos());
            posyJ = yFromPos(player.pos());

            posx = tabCells[i].posX;
            posy = tabCells[i].posY;

            // on trouve le chemin le plus court
            chemin = pathfinding(posx, posy, posxJ, posyJ);

            if (chemin.length == 0) aRefaire = 1;
        }
    }

    if (aRefaire) {
        supprimerTousObstacles();
        initialiserObstacles();
    }
}

function supprimerTousObstacles() {
    for (let i = 0; i < tabCells.length; i++) {
        if (contientEntite(tabCells[i]) && (tabCells[i].contenu.nom == "test"))
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


function numeroterBoard() {
    for (let y = 0; y < 10; y++) {
        for (let index = 0; index < 10; index++) {
            numero = index + 10 * y;
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
    diffX = xFromPos(pos1) - xFromPos(pos2);
    diffY = yFromPos(pos1) - yFromPos(pos2)
    diffTotale = Math.abs(diffX) + Math.abs(diffY);
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
    posAdjs = [];
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
    retirerToutesPrevisuPM();
    addPrevisuPM();
}

async function deplacerContenu(posDepart, posArrivee) {
    if (tabCells[posArrivee].contenu != null) {
        console.log("La cellule d'arrivée n'est pas vide");
    }
    else {
        tabCells[posArrivee].contenu = tabCells[posDepart].contenu;
        tabCells[posDepart].contenu = null;
    }
    refreshBoard();
    await new Promise(r => setTimeout(r, 100));
}




function trouverEntites(side) {
    tabMobs = [];
    for (let i = 0; i < tabCells.length; i++) {
        if (tabCells[i].contenu != null) {
            if (tabCells[i].contenu.side == side) {
                tabMobs.push(tabCells[i].contenu);
            }
        }
    }
    return tabMobs;
}

////////////////////////////////////FONCTION PASSER TOUR/////////////////////////////////////////
async function passerTourJoueur() {
    game.phase = "TURN_ENEMY";
    sortActif = null;
    retirerToutesPrevisuSort();

    var tabMobs = trouverEntites("ENEMY");
    player.resetPAPM();
    player.reduirecdSorts();
    griserOuDegriserSorts();
    refreshBoard();

    // faire jouer ennemis ici
    console.log(" aux ennemis de jouer");
    for (let i = 0; i < tabMobs.length; i++) {
        // faire jouer chaque ia ici, comment faire ?
        console.log(tabMobs[i].nom + " joue son tour.");
        await tabMobs[i].ia();
        tabMobs[i].resetPAPM();
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
    alert("gg");
}

function looseRound() {
    alert("Vous êtes mort");
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

function splash(elem, text) {
    {
        coords = getCoords(elem);
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

function initCdSorts() {

    for (let i = 0; i < tabCells.length; i++) {
        if (contientEntite(tabCells[i])) { tabCells[i].contenu.cdSorts = tabCells[i].contenu.resetcdSorts(); }
    }
}





function isInSight(posDep, posCible) { // check la Ligne de vue
 
    function w(e, t, n, r) {
        e = parseInt(e), t = parseInt(t);
        var o = (n = parseInt(n)) > e ? 1 : -1, a = (r = parseInt(r)) > t ? 1 : -1, s = !0, i = Math.abs(n - e), c = Math.abs(r - t), l = e, u = t, d = -1 + i + c, p = i - c; i *= 2, c *= 2;
        for (var m = 0; m < 1; m++)p > 0 ? (l += o, p -= c) : p < 0 ? (u += a, p += i) : (l += o, p -= c, u += a, p += i, d--);
        for (; d > 0 && s;)null != tabCells[u*10+l].contenu ? s = !1 : (p > 0 ? (l += o, p -= c) : p < 0 ? (u += a, p += i) : (l += o, p -= c, u += a, p += i, d--), d--);
        return s
    }

    return w(xFromPos(posDep), yFromPos(posDep), xFromPos(posCible), yFromPos(posCible));
}
