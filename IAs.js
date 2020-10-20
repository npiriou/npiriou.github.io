function pathfinding(Xdep, Ydep, Xarr, Yarr, listeAEnlever = []) {

    let graph = [];
    var i, j, temparray, chunk = 10;
    for (i = 0, j = tabCells.length; i < j; i += chunk) {
        temparray = tabCells.slice(i, i + chunk);

        for (let k = 0; k < temparray.length; k++) {
            if (temparray[k].contenu == null || listeAEnlever.includes(i * 10 + k)) {
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
    return chemin;
}

seDeplacer = async function (entite, posAr) { // bien penser a AWAIT a chaque fois qu'on l'appelle
    let chemin = trouverChemin(entite.pos(), posAr);
    for (let i = 0; i < chemin.length; i++) {
        if (tabCells[entite.pos()].contenu.PMact > 0) {
            await deplacerContenu(entite.pos(), posFromxy(chemin[i][0], chemin[i][1]));
            tabCells[entite.pos()].contenu.PMact--;
        }
    }
}
seDeplacerCommeSiSeulementBlocs = async function (entite, posAr) { // bien penser a AWAIT a chaque fois qu'on l'appelle
    let chemin = trouverCheminATraversEntites(entite.pos(), posAr);
    for (let i = 0; i < chemin.length; i++) {
        if (tabCells[entite.pos()].contenu.PMact > 0) {
            if ( !estVide(tabCells[posFromxy(chemin[i][0], chemin[i][1])]) ){
            await deplacerContenu(entite.pos(), posFromxy(chemin[i][0], chemin[i][1]));
            tabCells[entite.pos()].contenu.PMact--;}
            else break;
        }
    }
}



iaDebile = async function () {

    await seDeplacer(this, player.pos());
    await seDeplacerCommeSiSeulementBlocs(this, player.pos());

    // pour chaque sort on essaie de le lancer autant de fois que possible sur le joueur
    await spamSortsSurPlayer(this);
    let tabPosAdj = posAdjacentes(this.pos());
    for (let i = 0; i < tabPosAdj.length; i++) {

        if (contientEntite(tabCells[tabPosAdj[i]]) // si une des cases adjacentes contient une entité
            && tabCells[tabPosAdj[i]].contenu.side != "ENEMY") { // et que cette entité n'est pas un ennemi

            // pour chaque sort on essaie de le lancer autant de fois que possible sur l'entité
            for (let j = 0; j < this.sorts.length; j++) {
                if ((this.sorts[j].estAPortee(this.pos(), tabPosAdj[i], this.POBonus))
                    && (this.PAact >= this.sorts[j].coutPA)) {
                    while (this.PAact >= this.sorts[j].coutPA) {
                        game.sortActif = this.sorts[j];
                        if (contientEntite(tabCells[tabPosAdj[i]])) {
                            tabCells[tabPosAdj[i]].contenu.recevoirSort(this);
                        }
                        await new Promise(r => setTimeout(r, 100));
                        this.PAact = this.PAact - this.sorts[j].coutPA;
                    }
                }
            }
        }

    }
}

iaDebileRange = async function () {
    //   on récupere les pos du joueur et du mob qui joue
    let posxJ = xFromPos(player.pos());
    let posyJ = yFromPos(player.pos());

    let posx = xFromPos(this.pos());
    let posy = yFromPos(this.pos());

    // pour chaque sort on essaie de le lancer autant de fois que possible
    await spamSortsSurPlayer(this);
    // on récupère notre distance par rapport au joueur
    var distanceAct = pathfinding(posx, posy, posxJ, posyJ).length;
    var distanceMax = 0;
    var MaxPos = [];
    for (let i = 0; i < tabCells.length; i++) {
        var distanceCurrent = pathfinding(tabCells[i].posX, tabCells[i].posY, posxJ, posyJ).length;
        if ((distanceCurrent >= distanceAct) && distanceCurrent > distanceMax
            && (pathfinding(tabCells[i].posX, tabCells[i].posY, posx, posy).length <= this.PMact)
            && tabCells[i].contenu == null) {
            distanceMax = distanceCurrent;
            MaxPos = [tabCells[i].posX, tabCells[i].posY];
        }
    }
    if (distanceMax > 0) {
        // on trouve le chemin le plus court et on s'y déplace case par case
        let chemin = pathfinding(posx, posy, MaxPos[0], MaxPos[1]);
        for (let j = 0; j < chemin.length; j++) {
            if (this.PMact > 0) {
                await deplacerContenu(this.pos(), posFromxy(chemin[j][0], chemin[j][1]));
                this.PMact--;
            }
        }
    }

    // pour chaque sort on essaie de le lancer autant de fois que possible
    await spamSortsSurPlayer(this);
}



spamSortsSurPlayer = async function (entite) { // bien penser a AWAIT quand on l'appelle
    for (let i = 0; i < entite.sorts.length; i++) {
        if ((entite.sorts[i].estAPortee(entite.pos(), player.pos(), entite.POBonus))
            && (entite.PAact >= entite.sorts[i].coutPA)
            && ((!entite.sorts[i].LdV) || isInSight(entite.pos(), player.pos()))) {
            while (entite.PAact >= entite.sorts[i].coutPA) {
                game.sortActif = entite.sorts[i];
                player.recevoirSort(entite);
                await new Promise(r => setTimeout(r, 200));
                entite.PAact = entite.PAact - entite.sorts[i].coutPA;
            }
        }
    }
}

spamSortsSurEnnemi = async function (entite, ennemi) { // bien penser a AWAIT quand on l'appelle
    for (let i = 0; i < entite.sorts.length; i++) {
        if ((entite.sorts[i].estAPortee(entite.pos(), ennemi.pos(), entite.POBonus))
            && (entite.PAact >= entite.sorts[i].coutPA)
            && ((!entite.sorts[i].LdV) || isInSight(entite.pos(), ennemi.pos()))) {
            while (entite.PAact >= entite.sorts[i].coutPA) {
                game.sortActif = entite.sorts[i];
                tabCells[ennemi.pos()].recevoirSort(entite);
                await new Promise(r => setTimeout(r, 200));
                entite.PAact = entite.PAact - entite.sorts[i].coutPA;
                ennemi = getNearest(entite.pos(), "ENEMY"); // on refocus pour trouver un autre ennemi si il est mort
            }
        }
    }
}


iaRangeMoinsDebile = async function () {
    let invocATuer = trouverInvocations("ALLY")[0];
    let posPourLancer = trouverPosLaPlusProcheAPorteeDeDeplacementPourLancerSort(player.pos(), this, this.sorts[0]);
    let posPourLancer2;
    if (invocATuer) { posPourLancer2 = trouverPosLaPlusProcheAPorteeDeDeplacementPourLancerSort(invocATuer.pos(), this, this.sorts[0]); }

    if (posPourLancer != null) { // si il peut taper a ce tour

        await seDeplacer(this, posPourLancer); console.log(this.nom + " se deplace en pos pour attaquer");
        await spamSortsSurPlayer(this); console.log(this.nom + " a lancé tous ses sorts sur le joueur");
        await sEloignerAuMaxDuJoueur(this); console.log(this.nom + " recule ensuite");
    }
    else if (posPourLancer2 != null) { // si il peut taper une invoc a ce tour

        await seDeplacer(this, posPourLancer2); console.log(this.nom + " se deplace en pos pour attaquer");
        await spamSortsSurEnnemi(this, invocATuer); console.log(this.nom + " a lancé tous ses sorts sur l'invoc");

        // on refresh le focus au cas ou on a tué l'invoc
        invocATuer = trouverInvocations("ALLY")[0];
        if (invocATuer) {
            await sEloignerAuMax(this, invocATuer); console.log(this.nom + " recule ensuite");
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
        console.log(this.nom + " ne sera pas a portee du joueur, il avance");
    }

}



// pour tester bien demander si != null car la pos retournée peut etre '0'
function trouverPosLaPlusProcheAPorteeDeDeplacementPourLancerSort(posCible, entite, sort) {
    let tabPos = [];
    let tabPos2 = [];
    let dejaALaBonnePlace = 0;

    for (let i = 0; i < tabCells.length; i++) { //trouver LdV si le sort en a besoin
        if ((!sort.LdV) || (isInSight(tabCells[i].posNum, posCible))) {
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




sEloignerAuMaxDuJoueur = async function (entite) {
    //   on récupere les pos du joueur et du mob qui joue
    let posxJ = xFromPos(player.pos());
    let posyJ = yFromPos(player.pos());

    let posx = xFromPos(entite.pos());
    let posy = yFromPos(entite.pos());

    // on récupère notre distance par rapport au joueur
    var distanceAct = pathfinding(posx, posy, posxJ, posyJ).length;
    var distanceMax = 0;
    var MaxPos = [];
    for (let i = 0; i < tabCells.length; i++) {
        var distanceCurrent = pathfinding(tabCells[i].posX, tabCells[i].posY, posxJ, posyJ).length;
        if ((distanceCurrent >= distanceAct) && distanceCurrent > distanceMax
            && (pathfinding(tabCells[i].posX, tabCells[i].posY, posx, posy).length <= entite.PMact)
            && tabCells[i].contenu == null) {
            distanceMax = distanceCurrent;
            MaxPos = [tabCells[i].posX, tabCells[i].posY];
        }
    }
    if (distanceMax > 0) {
        // on trouve le chemin le plus court et on s'y déplace case par case
        let chemin = pathfinding(posx, posy, MaxPos[0], MaxPos[1]);
        for (let j = 0; j < chemin.length; j++) {
            if (entite.PMact > 0) {
                await deplacerContenu(entite.pos(), posFromxy(chemin[j][0], chemin[j][1]));
                entite.PMact--;
            }
        }
    }
}

sEloignerAuMax = async function (entite, ennemi) {
    //   on récupere les pos du joueur et du mob qui joue
    let posxJ = xFromPos(ennemi.pos());
    let posyJ = yFromPos(ennemi.pos());

    let posx = xFromPos(entite.pos());
    let posy = yFromPos(entite.pos());

    // on récupère notre distance par rapport au joueur
    var distanceAct = pathfinding(posx, posy, posxJ, posyJ).length;
    var distanceMax = 0;
    var MaxPos = [];
    for (let i = 0; i < tabCells.length; i++) {
        var distanceCurrent = pathfinding(tabCells[i].posX, tabCells[i].posY, posxJ, posyJ).length;
        if ((distanceCurrent >= distanceAct) && distanceCurrent > distanceMax
            && (pathfinding(tabCells[i].posX, tabCells[i].posY, posx, posy).length <= entite.PMact)
            && tabCells[i].contenu == null) {
            distanceMax = distanceCurrent;
            MaxPos = [tabCells[i].posX, tabCells[i].posY];
        }
    }
    if (distanceMax > 0) {
        // on trouve le chemin le plus court et on s'y déplace case par case
        let chemin = pathfinding(posx, posy, MaxPos[0], MaxPos[1]);
        for (let j = 0; j < chemin.length; j++) {
            if (entite.PMact > 0) {
                await deplacerContenu(entite.pos(), posFromxy(chemin[j][0], chemin[j][1]));
                entite.PMact--;
            }
        }
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
                            tabCells[tabPosAdj[i]].contenu.recevoirSort(this);
                        }
                        await new Promise(r => setTimeout(r, 100));
                        this.PAact = this.PAact - this.sorts[j].coutPA;
                    }
                }
            }
        }

    }
}

