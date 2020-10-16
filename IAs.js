iaMannequin = function () {
    console.log("Le mannequin vous sourit bêtement.");
}

function pathfinding(Xdep, Ydep, Xarr, Yarr) {

    let graph = [];
    var i, j, temparray, chunk = 10;
    for (i = 0, j = tabCells.length; i < j; i += chunk) {
        temparray = tabCells.slice(i, i + chunk);

        for (let k = 0; k < temparray.length; k++) {
            if (temparray[k].contenu == null) {
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
        cellule = [result[i].y, result[i].x]
        chemin.push(cellule);
    }
    return chemin;
}



iaDebile = async function () {
    //   on récupere les pos du joueur et du mob qui joue
    posxJ = xFromPos(player.pos());
    posyJ = yFromPos(player.pos());

    posx = xFromPos(this.pos());
    posy = yFromPos(this.pos());

    // on trouve le chemin le plus court et on s'y déplace case par case
    chemin = pathfinding(posx, posy, posxJ, posyJ);
    for (let i = 0; i < chemin.length; i++) {
        if (this.PMact > 0) {
            await deplacerContenu(this.pos(), posFromxy(chemin[i][0], chemin[i][1]));
            this.PMact--;
        }
    }
    // pour chaque sort on essaie de le lancer autant de fois que possible
    for (let i = 0; i < this.sorts.length; i++) {
        if (this.sorts[i].estAPortee(this.pos(), player.pos())) {
            while (this.PAact >= this.sorts[i].coutPA) {
                game.sortActif = this.sorts[i];
                player.recevoirSort();
                await new Promise(r => setTimeout(r, 100));
                this.PAact = this.PAact - this.sorts[i].coutPA;
            }
        }
    }
}

iaDebileRange = async function () {
    //   on récupere les pos du joueur et du mob qui joue
    posxJ = xFromPos(player.pos());
    posyJ = yFromPos(player.pos());

    posx = xFromPos(this.pos());
    posy = yFromPos(this.pos());

    // pour chaque sort on essaie de le lancer autant de fois que possible
    for (let i = 0; i < this.sorts.length; i++) {
        if (this.sorts[i].estAPortee(this.pos(), player.pos())) {
            while (this.PAact >= this.sorts[i].coutPA) {
                game.sortActif = this.sorts[i];
                player.recevoirSort();
                await new Promise(r => setTimeout(r, 100));
                this.PAact = this.PAact - this.sorts[i].coutPA;
            }
        }
    }
    // on récupère notre distance par rapport au joueur
    distanceAct = pathfinding(posx, posy, posxJ, posyJ).length;
    distanceMax = 0;
    MaxPos = [];
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
    chemin = pathfinding(posx, posy, MaxPos[0], MaxPos[1]);
    for (let j = 0; j < chemin.length; j++) {
        if (this.PMact > 0) {
            await deplacerContenu(this.pos(), posFromxy(chemin[j][0], chemin[j][1]));
            this.PMact--;
        }
    }
    }






    // pour chaque sort on essaie de le lancer autant de fois que possible
    for (let i = 0; i < this.sorts.length; i++) {
        if (this.sorts[i].estAPortee(this.pos(), player.pos())) {
            while (this.PAact >= this.sorts[i].coutPA) {
                game.sortActif = this.sorts[i];
                player.recevoirSort();
                await new Promise(r => setTimeout(r, 100));
                this.PAact = this.PAact - this.sorts[i].coutPA;
            }
        }
    }
}