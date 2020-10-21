function pathfinding(Xdep, Ydep, Xarr, Yarr, listeAEnlever = []) {

    let graph = [];
    var i, j, temparray, chunk = 10;
    for (i = 0, j = tabCells.length; i < j; i += chunk) {
        temparray = tabCells.slice(i, i + chunk);

        for (let k = 0; k < temparray.length; k++) {
            if (temparray[k].contenu == null || listeAEnlever.includes(i + k)) {
                temparray[k] = 1;
            }
            else temparray[k] = 0;
        }

        graph.push(temparray);
    }
    graph[Yarr][Xarr] = 1;
    graph[Ydep][Xdep] = 1;
    graph = new Graph(graph);
    var start = graph.grid[Ydep][Xdep];
    var end = graph.grid[Yarr][Xarr];
    var result = astar.search(graph, start, end);
    var chemin = [];
    for (let i = 0; i < result.length; i++) {
        var cellule = [result[i].y, result[i].x]
        chemin.push(cellule);
    }
    delete graph;
    return chemin;
}

function trouverChemin(posDep, posAr) {
    let posxar = xFromPos(posAr);
    let posyar = yFromPos(posAr);

    let posx = xFromPos(posDep);
    let posy = yFromPos(posDep);
    return pathfinding(posx, posy, posxar, posyar);
}

function trouverCheminATraversEntites(posDep, posAr) {
    let posxar = xFromPos(posAr);
    let posyar = yFromPos(posAr);

    let posx = xFromPos(posDep);
    let posy = yFromPos(posDep);
    return pathfindingAcrossEntities(posx, posy, posxar, posyar);
}
function trouverCheminPoidsBoite(posDep, posAr) {
    let posxar = xFromPos(posAr);
    let posyar = yFromPos(posAr);

    let posx = xFromPos(posDep);
    let posy = yFromPos(posDep);
    return pathfindingPoidsBoites(posx, posy, posxar, posyar);
}

function pathfindingAcrossEntities(Xdep, Ydep, Xarr, Yarr, listeAEnlever = []) {

    let graph = [];
    var i, j, temparray, chunk = 10;
    for (i = 0, j = tabCells.length; i < j; i += chunk) {
        temparray = tabCells.slice(i, i + chunk);

        for (let k = 0; k < temparray.length; k++) {
            if (temparray[k].contenu == null || temparray[k].contenu.nom != "Boite" || listeAEnlever.includes(i * 10 + k)) {
                temparray[k] = 1;
            }
            else temparray[k] = 0;
        }

        graph.push(temparray);
    }
    graph[Yarr][Xarr] = 1;
    graph[Ydep][Xdep] = 1;
    graph = new Graph(graph);
    var start = graph.grid[Ydep][Xdep];
    var end = graph.grid[Yarr][Xarr];
    var result = astar.search(graph, start, end);
    var chemin = [];
    for (let i = 0; i < result.length; i++) {
        var cellule = [result[i].y, result[i].x]
        chemin.push(cellule);
    }
    delete graph;
    return chemin;
}

function pathfindingPoidsBoites(Xdep, Ydep, Xarr, Yarr, listeAEnlever = []) {
    let graph = [];
    var i, j, temparray, chunk = 10;
    for (i = 0, j = tabCells.length; i < j; i += chunk) {
        temparray = tabCells.slice(i, i + chunk);

        for (let k = 0; k < temparray.length; k++) {
            if (temparray[k].contenu == null || listeAEnlever.includes(i * 10 + k)) {
                temparray[k] = 1;
            }
            else if (temparray[k].contenu && (temparray[k].contenu.nom == "Boite")) {
                temparray[k] = 4;
            }
            else temparray[k] = 0;
        }

        graph.push(temparray);
    }
    graph[Yarr][Xarr] = 1;
    graph[Ydep][Xdep] = 1;
    graph = new Graph(graph);
    var start = graph.grid[Ydep][Xdep];
    var end = graph.grid[Yarr][Xarr];
    var result = astar.search(graph, start, end);
    var chemin = [];
    for (let i = 0; i < result.length; i++) {
        var cellule = [result[i].y, result[i].x]
        chemin.push(cellule);
    }
    delete graph;
    return chemin;
}

casserBoiteGenante = async function (entite, posAr) { // bien penser a AWAIT a chaque fois qu'on l'appelle
    let chemin = trouverCheminPoidsBoite(entite.pos(), posAr);
    let cellTestee;
    let posPourTaper = null;

    for (let i = 0; i < chemin.length; i++) {
        cellTestee = tabCells[posFromxy(chemin[i][0], chemin[i][1])];
        if ((cellTestee.contenu) && (cellTestee.contenu.side == "NEUTRAL")) {
            posPourTaper = trouverPosLaPlusProcheAPorteeDeDeplacementPourLancerSort(cellTestee.posNum, entite, entite.sorts[0])
            if (posPourTaper != null) {
                await seDeplacer(entite, posPourTaper);
                await lancerUnSortSurEnnemi(entite, cellTestee.contenu);
            }
        }
    }
    await seDeplacerPoidsBoites(entite, posAr);
}

seDeplacer = async function (entite, posAr) { // bien penser a AWAIT a chaque fois qu'on l'appelle
    let chemin = trouverChemin(entite.pos(), posAr);
    for (let i = 0; i < chemin.length; i++) {
        if (tabCells[entite.pos()].contenu.PMact > 0) {
            // si le deplacement a reussi l'entite perd un pm
            if (await deplacerContenu(entite.pos(), posFromxy(chemin[i][0], chemin[i][1]))) {
                tabCells[entite.pos()].contenu.PMact--;
            }
            else break;
        }
    }
}
seDeplacerCommeSiSeulementBlocs = async function (entite, posAr) { // bien penser a AWAIT a chaque fois qu'on l'appelle
    let chemin = trouverCheminATraversEntites(entite.pos(), posAr);
    for (let i = 0; i < chemin.length; i++) {
        if (tabCells[entite.pos()].contenu.PMact > 0) {
            if (await deplacerContenu(entite.pos(), posFromxy(chemin[i][0], chemin[i][1]))) {
                tabCells[entite.pos()].contenu.PMact--;
            }
            else break;
        }
    }
}
seDeplacerPoidsBoites = async function (entite, posAr) { // bien penser a AWAIT a chaque fois qu'on l'appelle
    let chemin = trouverCheminPoidsBoite(entite.pos(), posAr);
    for (let i = 0; i < chemin.length; i++) {
        if (tabCells[entite.pos()].contenu.PMact > 0) {
            if (await deplacerContenu(entite.pos(), posFromxy(chemin[i][0], chemin[i][1]))) {
                tabCells[entite.pos()].contenu.PMact--;
            }
            else break;
        }
    }
}



spamSortsSurPlayer = async function (entite) { // bien penser a AWAIT quand on l'appelle
    for (let i = 0; i < entite.sorts.length; i++) {
        if ((entite.sorts[i].estAPortee(entite.pos(), player.pos(), entite.POBonus))
            && (entite.PAact >= entite.sorts[i].coutPA)
            && (entite.cdSorts[i] <= 0)
            && ((!entite.sorts[i].LdV) || isInSight(entite.pos(), player.pos()))) {
            while (entite.PAact >= entite.sorts[i].coutPA) {
                game.sortActif = entite.sorts[i];
                tabCells[player.pos()].recevoirSort(entite);
                await sleep(200);;
                entite.PAact = entite.PAact - entite.sorts[i].coutPA;
                entite.mettreSortEnCd();
            }
        }
    }
}

spamSortsSurEnnemi = async function (entite, ennemi) { // bien penser a AWAIT quand on l'appelle
    for (let i = 0; i < entite.sorts.length; i++) {
        if ((entite.sorts[i].estAPortee(entite.pos(), ennemi.pos(), entite.POBonus))
            && (entite.PAact >= entite.sorts[i].coutPA)
            && (entite.cdSorts[i] <= 0)
            && ((!entite.sorts[i].LdV) || isInSight(entite.pos(), ennemi.pos()))) {
            while (entite.PAact >= entite.sorts[i].coutPA) {
                game.sortActif = entite.sorts[i];
                tabCells[ennemi.pos()].recevoirSort(entite);
                await sleep(200);;
                entite.PAact = entite.PAact - entite.sorts[i].coutPA;
                entite.mettreSortEnCd();
                ennemi = getNearest(entite.pos(), ennemi.side); // on refocus pour trouver un autre ennemi si il est mort
            }
        }
    }
}
lancerUnSortSurEnnemi = async function (entite, ennemi) { // bien penser a AWAIT quand on l'appelle
    for (let i = 0; i < entite.sorts.length; i++) {
        if ((entite.sorts[i].estAPortee(entite.pos(), ennemi.pos(), entite.POBonus))
            && (entite.PAact >= entite.sorts[i].coutPA)
            && (entite.cdSorts[i] <= 0)
            && ((!entite.sorts[i].LdV) || isInSight(entite.pos(), ennemi.pos()))) {
            game.sortActif = entite.sorts[i];
            tabCells[ennemi.pos()].recevoirSort(entite);
            await sleep(200);;
            entite.PAact = entite.PAact - entite.sorts[i].coutPA;
            entite.mettreSortEnCd();
        }
    }
}
lancerUnSortSurCell = async function (entite, cell, i = 0) { // bien penser a AWAIT quand on l'appelle
    for (i ; i < entite.sorts.length; i++) {// on peut rentrer direct le num du sort si on le connait
        if ((entite.sorts[i].estAPortee(entite.pos(), cell.posNum, entite.POBonus))
            && (entite.PAact >= entite.sorts[i].coutPA)
            && (entite.cdSorts[i] <= 0)
            && ((!entite.sorts[i].LdV) || isInSight(entite.pos(), cell.posNum))) {
            game.sortActif = entite.sorts[i];
            cell.recevoirSort(entite);
            entite.PAact = entite.PAact - entite.sorts[i].coutPA;
            entite.mettreSortEnCd();
            await sleep(200);;

            break;
        }
    }
}





iaRangeMoinsDebile = async function () {
    let invocATuer = trouverInvocations("ALLY")[0];
    let posPourLancer = trouverPosLaPlusProcheAPorteeDeDeplacementPourLancerSort(player.pos(), this, this.sorts[0]);
    let posPourLancer2;
    if (invocATuer) { posPourLancer2 = trouverPosLaPlusProcheAPorteeDeDeplacementPourLancerSort(invocATuer.pos(), this, this.sorts[0]); }

    if (posPourLancer != null) { // si il peut taper a ce tour

        await seDeplacer(this, posPourLancer);
        await spamSortsSurPlayer(this);
        await sEloignerAuMax(this, player);
    }
    else if (posPourLancer2 != null) { // si il peut taper une invoc a ce tour

        await seDeplacer(this, posPourLancer2);
        await spamSortsSurEnnemi(this, invocATuer);

        // on refresh le focus au cas ou on a tué l'invoc
        invocATuer = trouverInvocations("ALLY")[0];
        if (invocATuer) {
            await sEloignerAuMax(this, invocATuer);
        }
        else {
            await seDeplacer(this, player.pos());
            await seDeplacerCommeSiSeulementBlocs(this, player.pos());
        }
    }
    else { // si il ne peut taper personne
        await seDeplacer(this, player.pos());
        await seDeplacerCommeSiSeulementBlocs(this, player.pos());
        if (invocATuer) {
            await seDeplacer(this, invocATuer.pos());
            await seDeplacerCommeSiSeulementBlocs(this, invocATuer.pos());
        }

        // si vraiment y'a pas de ldv, on casse une boite genante
        await casserBoiteGenante(this, player.pos());
        // si y'a une LdV trop loin pour se tour, on va vers elle pour le prochain
        posPourLancer = trouverPosLaPlusProchePourLancerSort(player.pos(), this, this.sorts[0]);
        if (posPourLancer != null) {
            await seDeplacer(this, posPourLancer);
        }


    }

    await sEloignerAuMax(this, this); // si le player etait inaccessible mais en ldv, on sort de ldv

}



// pour tester bien demander si != null car la pos retournée peut etre '0'
function trouverPosLaPlusProcheAPorteeDeDeplacementPourLancerSort(posCible, entite, sort) {
    let tabPos = [];
    let tabPos2 = [];
    let dejaALaBonnePlace = 0;

    for (let i = 0; i < tabCells.length; i++) { //trouver LdV si le sort en a besoin
        if ((!sort.LdV) || (isInSight(tabCells[i].posNum, posCible, entite.pos()))) {
            tabPos.push(tabCells[i].posNum);
        }
    }

    for (let i = 0; i < tabPos.length; i++) {
        // on recupere toutes les cases a portee qui sont vide (ou qui sont la pos de l'entite qui tire)
        if (sort.estAPortee(tabPos[i], posCible, entite.POBonus) && (estVide(tabCells[tabPos[i]]) || tabPos[i] == entite.pos())) {
            tabPos2.push(tabPos[i]);
        }
    }
    let plusCourtChemin = [];
    plusCourtChemin.length = 1000;
    let posFinale = 1000;
    for (let i = 0; i < tabPos2.length; i++) {
        if (tabPos2[i] == entite.pos()) {
            dejaALaBonnePlace = 1; return entite.pos();
        }

        else {
            chemin = estAPorteeDeDeplacement(entite.pos(), tabPos2[i], entite.PMact);
            if ((chemin) && (chemin.length < plusCourtChemin.length)) {
                plusCourtChemin = chemin;
                posFinale = tabPos2[i];
            }
        }
    }
    if (posFinale == 1000) return null;
    else return posFinale;
}

// pour tester bien demander si != null car la pos retournée peut etre '0'
function trouverPosLaPlusProchePourLancerSort(posCible, entite, sort) {
    let tabPos = [];
    let tabPos2 = [];
    let dejaALaBonnePlace = 0;

    for (let i = 0; i < tabCells.length; i++) { //trouver LdV si le sort en a besoin
        if ((!sort.LdV) || (isInSight(tabCells[i].posNum, posCible, entite.pos()))) {
            tabPos.push(tabCells[i].posNum);
        }
    }

    for (let i = 0; i < tabPos.length; i++) {
        // on recupere toutes les cases a portee qui sont vide (ou qui sont la pos de l'entite qui tire)
        if (sort.estAPortee(tabPos[i], posCible, entite.POBonus) && (estVide(tabCells[tabPos[i]]) || tabPos[i] == entite.pos())) {
            tabPos2.push(tabPos[i]);
        }
    }
    let plusCourtChemin = [];
    plusCourtChemin.length = 1000;
    let posFinale = 1000;
    for (let i = 0; i < tabPos2.length; i++) {
        if (tabPos2[i] == entite.pos()) {
            dejaALaBonnePlace = 1; return entite.pos();
        }

        else {
            chemin = estAPorteeDeDeplacement(entite.pos(), tabPos2[i], 999);
            if ((chemin) && (chemin.length < plusCourtChemin.length)) {
                plusCourtChemin = chemin;
                posFinale = tabPos2[i];
            }
        }
    }
    if (posFinale == 1000) return null;
    else return posFinale;
}


sEloignerAuMax = async function (entite, ennemi) {
    //   on récupere les pos du joueur et du mob qui joue
    let posxJ = xFromPos(ennemi.pos());
    let posyJ = yFromPos(ennemi.pos());

    let posx = () => { return xFromPos(entite.pos()) };
    let posy = () => { return yFromPos(entite.pos()) };

    // on récupère notre distance par rapport au joueur
    var distanceAct = pathfinding(posxJ, posyJ, posx(), posy()).length;
    var distanceMax = 0;
    var MaxPos = [];
    for (let i = 0; i < tabCells.length; i++) {
        if (tabCells[i].contenu)
            continue;
        var distanceEnnemiVersCase = pathfinding(posxJ, posyJ, tabCells[i].posX, tabCells[i].posY, [entite.pos()]).length;
        var distanceEntiteVersCase = pathfinding(tabCells[i].posX, tabCells[i].posY, posx(), posy(), [entite.pos()]).length;
        if ((distanceEnnemiVersCase >= distanceAct) && distanceEnnemiVersCase > distanceMax
            && (distanceEntiteVersCase <= entite.PMact) && (distanceEntiteVersCase > 0)) {
            distanceMax = distanceEnnemiVersCase;
            MaxPos = [tabCells[i].posX, tabCells[i].posY];
        }
    }
    if (distanceMax > 0) {
        await seDeplacer(entite, posFromxy(MaxPos[0], MaxPos[1]));
    }
}


function getNearest(pos, side) {
    let tabEntites = trouverEntites(side);
    let plusCourtChemin = [];
    let cheminTest;
    let plusProcheEntite;
    plusCourtChemin.length = 1000;

    for (let i = 0; i < tabEntites.length; i++) {
        cheminTest = trouverChemin(pos, tabEntites[i].pos());
        if (cheminTest.length < plusCourtChemin.length) {
            plusCourtChemin = cheminTest;
            plusProcheEntite = tabEntites[i];
        }
    }

    return plusProcheEntite;
}

iaDebile_ALLY = async function () {
    ennemi = getNearest(this.pos(), "ENEMY");

    await seDeplacer(this, ennemi.pos());
    await seDeplacerCommeSiSeulementBlocs(this, ennemi.pos());

    // pour chaque sort on essaie de le lancer autant de fois que possible sur l'ennemi
    //  await spamSortsSurPlayer(this);
    await spamSortsSurEnnemi(this, ennemi);

    let tabPosAdj = posAdjacentes(this.pos());
    for (let i = 0; i < tabPosAdj.length; i++) {

        if (contientEntite(tabCells[tabPosAdj[i]]) // si une des cases adjacentes contient une entité
            && tabCells[tabPosAdj[i]].contenu.side != "ALLY") { // et que cette entité n'est pas un allié

            // pour chaque sort on essaie de le lancer autant de fois que possible sur l'entité
            for (let j = 0; j < this.sorts.length; j++) {
                if ((this.sorts[j].estAPortee(this.pos(), tabPosAdj[i], this.POBonus))
                    && (this.PAact >= this.sorts[j].coutPA)) {
                    while (this.PAact >= this.sorts[j].coutPA) {
                        game.sortActif = this.sorts[j];
                        if (contientEntite(tabCells[tabPosAdj[i]])) {
                            tabCells[tabPosAdj[i]].recevoirSort(this);
                        }
                        await sleep(100);
                        this.PAact = this.PAact - this.sorts[j].coutPA;
                    }
                }
            }
        }

    }
}

iaDebile = async function () {

    await flashIn(this);
    await boostRage(this);
    await seDeplacer(this, player.pos());
    await seDeplacerCommeSiSeulementBlocs(this, player.pos());

    // pour chaque sort on essaie de le lancer autant de fois que possible sur le joueur
    await spamSortsSurPlayer(this);

    await casserBoiteGenante(this, player.pos());


    // si une des cases adjacentes contient une entité non ENEMY on la tabasse au passage
    let tabPosAdj = posAdjacentes(this.pos());
    for (let i = 0; i < tabPosAdj.length; i++) {

        if (contientEntite(tabCells[tabPosAdj[i]])
            && tabCells[tabPosAdj[i]].contenu.side != "ENEMY") { // si cette entité n'est pas un ennemi

            // pour chaque sort on essaie de le lancer autant de fois que possible sur l'entité
            for (let j = 0; j < this.sorts.length; j++) {
                if ((this.sorts[j].estAPortee(this.pos(), tabPosAdj[i], this.POBonus))
                    && (this.cdSorts[j] <= 0)
                    && (this.PAact >= this.sorts[j].coutPA)) {
                    while (this.PAact >= this.sorts[j].coutPA) {
                        game.sortActif = this.sorts[j];
                        if (contientEntite(tabCells[tabPosAdj[i]])) {
                            tabCells[tabPosAdj[i]].recevoirSort(this);
                        }
                        await sleep(100);
                        this.PAact = this.PAact - this.sorts[j].coutPA;
                    }
                }
            }
        }

    }
}

async function flashIn(entite) {
    let chemin = trouverChemin(entite.pos(), player.pos());
    if (chemin.length > 1) {
        let posTestee = posFromxy(chemin[1][0], chemin[1][1]); // chemin[1] pour la portee max du flash
        if (posTestee && estVide(posTestee)) { // la pos est disponible pour le flash in

            for (let i = 0; i < entite.sorts.length; i++) {
                if (entite.sorts[i] == flash) {
                    await lancerUnSortSurCell(entite, tabCells[posTestee], i);
                    return 1;
                }
            }
        }
    }
    return 0;
}

async function boostRage(entite) {
    for (let i = 0; i < entite.sorts.length; i++) {
        if (entite.sorts[i] == rage) {
            debugger;
            await lancerUnSortSurCell(entite, tabCells[entite.pos()], i);
            return 1;
        }
    }
    return 0;
}