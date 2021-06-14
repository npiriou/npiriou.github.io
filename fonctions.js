const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const initialisationSorts = () => {
  for (let i = 0; i < player.sorts.length; i++) {
    document.getElementsByClassName("sort")[
      i
    ].innerHTML = `<div class='spellHov'><img data-toggle="tooltip" data-placement="top"  
            title="
      ${player.sorts[i].nom} 
       
      ${player.sorts[i].coutPA}
       PA" id="art" class='artSpell'
            src =" 
      ${player.sorts[i].logo} 
      " >
            </img></div>`;
    document
      .getElementsByClassName("sort")
      [i].addEventListener("mouseover", onHoverSort);
    document.getElementsByClassName("sort")[i].classList.add("pointer");
  }
  $('[data-toggle="tooltip"]').tooltip(); // active les tooltips
};

const initialisationCellules = () => {
  for (let index = 0; index < 100; index++) {
    let celli = new cell(index, index % 10, Math.trunc(index / 10), null);
    tabCells.push(celli);
  }
};

const initialiserObstacles = () => {
  let aRefaire = 0;
  for (let i = 0; i < tabCells.length; i++) {
    if (contientEntite(tabCells[i])) continue;
    if (getRandomInt(5) == 0)
      // changer ici pour modifier le nb d'obstacles sur la map
      tabCells[i].contenu = boite.clone();
  }
  for (let i = 0; i < tabCells.length; i++) {
    if (
      contientEntite(tabCells[i]) &&
      tabCells[i].contenu.nom != "Tonneau" &&
      tabCells[i].contenu != player
    ) {
      //   on récupere les pos du joueur et du mob détecté
      let posxJ = xFromPos(player.pos());
      let posyJ = yFromPos(player.pos());

      let posx = tabCells[i].posX;
      let posy = tabCells[i].posY;

      // on trouve le chemin le plus court
      let chemin = pathfinding(posx, posy, posxJ, posyJ);

      if (chemin.length == 0) {
        aRefaire = 1;
      }
    }
  }

  if (aRefaire) {
    supprimerTousObstacles();
    initialiserObstacles();
  }
};

const supprimerTousObstacles = () => {
  for (let i = 0; i < tabCells.length; i++) {
    if (contientEntite(tabCells[i]) && tabCells[i].contenu.nom == "Tonneau")
      tabCells[i].contenu = null;
  }
  refreshBoard();
};

const viderBoard = () => {
  for (let i = 0; i < tabCells.length; i++) {
    if (tabCells[i].contenu) {
      delete tabCells[i].contenu;
    }
    tabCells[i].contenu = null;
  }
  refreshBoard();
};

const estVide = (cel) => cel.contenu == null;

const estObstacle = (cel) => cel.contenu == "OBSTACLE";

const contientEntite = (cel) => cel.contenu && typeof cel.contenu === "object";

const sontEnLigne = (posa, posb) =>
  xFromPos(posa) == xFromPos(posb) || yFromPos(posa) == yFromPos(posb);

const numeroterBoard = () => {
  for (let y = 0; y < 10; y++) {
    for (let index = 0; index < 10; index++) {
      let numero = index + 10 * y;
      document.getElementById("board").rows[y].cells[
        index
      ].innerHTML = `<div id=${numero} class='divCell'></div>`;
    }
  }
};

const xFromPos = (pos) => pos % 10;

const yFromPos = (pos) => Math.trunc(pos / 10);

const posFromxy = (x, y) => 10 * y + x;

const distance = (pos1, pos2) => {
  let diffX = xFromPos(pos1) - xFromPos(pos2);
  let diffY = yFromPos(pos1) - yFromPos(pos2);
  return Math.abs(diffX) + Math.abs(diffY);
};

const estAdjacente = (pos1, pos2) =>
  (xFromPos(pos1) - 1 == xFromPos(pos2) && yFromPos(pos1) == yFromPos(pos2)) ||
  (xFromPos(pos1) + 1 == xFromPos(pos2) && yFromPos(pos1) == yFromPos(pos2)) ||
  (yFromPos(pos1) - 1 == yFromPos(pos2) && xFromPos(pos1) == xFromPos(pos2)) ||
  (yFromPos(pos1) + 1 == yFromPos(pos2) && xFromPos(pos1) == xFromPos(pos2));

const posAdjacentes = (pos) =>
  tabCells
    .filter((cel) => estAdjacente(pos, cel.posNum))
    .map((cel) => cel.posNum);

const refreshBoard = () => {
  tabCells.forEach((cel) => {
    if (cel.contenu != null) {
      document.getElementById("board").rows[cel.posY].cells[
        cel.posX
      ].children[0].innerHTML = `<img id="art"class="artEntite" data-toggle="tooltip" data-placement="top"
                 src ="
        ${cel.contenu.skin} " 
                 title="
        ${cel.contenu.nom}  (
        ${cel.contenu.PVact} / 
        ${cel.contenu.PVmax} )"
                 </img>`;

      if (cel.contenu.side == "ALLY") {
        document
          .getElementById("board")
          .rows[cel.posY].cells[cel.posX].classList.add("cellAlly");
      }
      if (cel.contenu.side == "ENEMY") {
        document
          .getElementById("board")
          .rows[cel.posY].cells[cel.posX].classList.add("cellEnemy");
      }
    } else {
      document.getElementById("board").rows[cel.posY].cells[
        cel.posX
      ].children[0].innerHTML = "";
      document
        .getElementById("board")
        .rows[cel.posY].cells[cel.posX].classList.remove("cellAlly");
      document
        .getElementById("board")
        .rows[cel.posY].cells[cel.posX].classList.remove("cellEnemy");
    }
  });
  $(".tooltip").remove(); //supprime toutes les tooltips affichées
  $('[data-toggle="tooltip"]').tooltip(); // refresh les tooltips
};

const deplacerContenu = async (posDepart, posArrivee) => {
  if (tabCells[posArrivee].contenu != null) {
    return 0;
  } else {
    pivoterEntite(tabCells[posDepart].contenu, posArrivee);
    tabCells[posArrivee].contenu = tabCells[posDepart].contenu;
    tabCells[posDepart].contenu = null;
  }
  await refreshBoard();
  await sleep(100);
  return 1;
};

const deplacerContenuInstantane = (posDepart, posArrivee) => {
  if (tabCells[posArrivee].contenu != null) {
    ajouterAuChatType("La cellule d'arrivée n'est pas vide", 0);
  } else {
    pivoterEntite(tabCells[posDepart].contenu, posArrivee);
    tabCells[posArrivee].contenu = tabCells[posDepart].contenu;
    tabCells[posDepart].contenu = null;
  }
  refreshBoard();
};

const trouverEntites = (side) =>
  tabCells
    .filter((cel) => cel.contenu && cel.contenu.side == side)
    .map((cel) => cel.contenu);

const trouverInvocations = (side) =>
  tabCells
    .filter(
      (cel) =>
        cel.contenu && cel.contenu.side == side && cel.contenu.invocation,
    )
    .map((cel) => cel.contenu);

////////////////////////////////////FONCTION PASSER TOUR/////////////////////////////////////////
const passerTourJoueur = async () => {
  if (!game.phase.includes("TURN_PLAYER")) {
    return;
  }
  sortActif = null;
  retirerToutesPrevisuSort();
  player.resetPAPM();
  await player.reduirecdSorts();
  griserOuDegriserSorts();
  refreshBoard();

  game.phase = "TURN_ALLY_INVOCATIONS";
  let tabMobs = trouverInvocations("ALLY");
  // can't use forEach here because it does not work with async functions :(
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

  tabMobs = trouverEntites("ENEMY");
  if (tabMobs.length > 0) game.phase = "TURN_ENEMY";
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
  if (game.phase == "TURN_ENEMY") {
    game.phase = "TURN_PLAYER_MOVE";
  }
  player.reduireDureeEffets();
  griserOuDegriserSorts();
};

const griserOuDegriserSorts = () => {
  for (let i = 0; i < player.sorts.length; i++) {
    if (player.sorts[i].coutPA > player.PAact || player.cdSorts[i] > 0) {
      document
        .getElementsByClassName("sort")
        [i].children[0].classList.add("disabled");
    }
    if (player.sorts[i].coutPA <= player.PAact && player.cdSorts[i] <= 0) {
      document
        .getElementsByClassName("sort")
        [i].children[0].classList.remove("disabled");
    }
  }
};

const checkEndRound = () => {
  tabMobs = [];
  for (let i = 0; i < tabCells.length; i++) {
    if (tabCells[i].contenu != null) {
      if (tabCells[i].contenu.side == "ENEMY") {
        tabMobs.push(tabCells[i].contenu);
      }
    }
  }
  if (tabMobs.length == 0) winRound();
  else if (player.PVact <= 0) loseRound();
};

const winRound = () => {
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
  game.totalKills += game.nbMobsGenerated;
  game.level++;
  document.getElementById("titre").innerHTML = "Étage " + game.level;
  saveRecord();

  randomiserBonusAffiches();
  player.afficherStatsEntite();
  game.phase = "MENU";
  // on affiche la modal - les parametres l'empeche de se fermer en cliquant au fond ou avec echap
  $(`#modalChooseBonus`).modal({ backdrop: "static", keyboard: false });
};

const loseRound = async () => {
  game.phase = "END";
  await sleep(600);
  let record = loadRecord();
  if (
    confirm(
      "Vous êtes mort. Votre score : étage " +
        game.level +
        ". Votre record était de " +
        record +
        " étages.",
    )
  ) {
    saveRecord();
    location.reload();
  } else {
    saveRecord();
    location.reload();
  }
};
const saveRecord = async () => {
  let tabMobs = trouverEntites("ENEMY");
  let ancienRecordlevel = loadRecord();
  let record = { level: game.level, mobs: tabMobs, player: player };
  let newTotalKills = loadKills() + game.nbMobsGenerated;
  if (ancienRecordlevel < record.level) {
    localStorage.setItem("record", JSON.stringify(record));
  }
  localStorage.setItem("nbKills", newTotalKills);
};

const loadKills = () => {
  let nbKills = localStorage.getItem("nbKills");
  if (!nbKills) return 0;
  nbKills = JSON.parse(nbKills);
  return nbKills;
};

const loadRecord = () => {
  let record = localStorage.getItem("record");
  if (!record) return 0;
  record = JSON.parse(record);
  return record.level;
};

const copy = (a) => {
  return JSON.parse(JSON.stringify(a));
};

const ajouterJoueur = () => {
  let randoPosPlayer = getRandomInt(20);
  tabCells[randoPosPlayer].contenu = player;
};

const newRound = () => {
  ajouterJoueur();

  poidsSelonLevel();
  remplirSelonPoids();

  initialiserObstacles();
  initCdSorts();

  triggerDebutCombat();
  refreshBoard();
  game.phase = "TURN_PLAYER_MOVE";
};

const sauvegarde = () => {
  let save = {
    player: player,
    level: game.level,
    effets: game.effets,
    map: game.map,
  };
  localStorage.setItem("sauvegarde", JSON.stringify(save));
};

const charger = () => {
  // player loading
  let chargement = localStorage.getItem("sauvegarde");
  if (!chargement) return 0;
  chargement = JSON.parse(chargement);
  localStorage.removeItem("sauvegarde");
  game.level = chargement.level;
  player.PAmax = chargement.player.PAmax;
  player.PMmax = chargement.player.PMmax;
  player.PVmax = chargement.player.PVmax;
  player.PVact = chargement.player.PVact;
  player.POBonus = chargement.player.POBonus;
  player.bonusDo = chargement.player.bonusDo;
  player.pourcentDo = chargement.player.pourcentDo;
  player.pourcentCrit = chargement.player.pourcentCrit;
  player.skin = chargement.player.skin;

  for (let i = 0; i < chargement.effets.length; i++) {
    let effet = listeGameEffets.filter(
      (effet) => effet.nom == chargement.effets[i].nom,
    )[0];
    game.effets.push(effet);
  }

  for (let i = 0; i < chargement.player.sorts.length; i++) {
    if (
      ["CAC", "MJPOSERBOITE", "DOOM", "MJTP"].includes(
        chargement.player.sorts[i].code,
      )
    )
      continue;
    let sort = listeSorts.filter(
      (sort) => sort.code == chargement.player.sorts[i].code,
    )[0];

    if (!sort) debugger;
    ajouterNouveauSort(listeSorts, sort);
  }
  player.resetPAPM();
  document.getElementById("titre").innerHTML = "Étage " + game.level;

  // map loading
  if (chargement.map) {
    document.getElementById("board").classList.add(chargement.map);
  }
};

const randomiserBonusAffiches = () => {
  removeClassesFromExcessBonus();
  let boutonsBonus = document.getElementsByClassName("bouton_bonus");
  let boutonsBonusRares = document.getElementsByClassName("bouton_bonus_rare");
  let boutonsBonusClasses = document.getElementsByClassName(
    "bouton_bonus_classe",
  );
  let totalBonusAffiches = 3;
  let bonusRareAffiche = 0;
  // on cache tous les bonus
  for (let i = 0; i < boutonsBonus.length; i++) {
    boutonsBonus[i].style.display = "none";
  }
  for (let i = 0; i < boutonsBonusRares.length; i++) {
    boutonsBonusRares[i].style.display = "none";
  }
  for (let i = 0; i < boutonsBonusClasses.length; i++) {
    boutonsBonusClasses[i].style.display = "none";
  }

  if (game.level > 1) {
    if (game.level % 5 === 1) {
      // tous les 5 lvl, 4 bonus rares proposés
      for (let i = 0; i < totalBonusAffiches + 1; i++) {
        let a = getRandomInt(boutonsBonusRares.length);
        boutonsBonusRares[a].style.display === "none"
          ? (boutonsBonusRares[a].style.display = "flex")
          : totalBonusAffiches++;
      }
    } else {
      // lvl "normaux"
      if (getRandomInt(2) === 0) {
        // 1/3 d'avoir un bonus rare proposé
        boutonsBonusRares[
          getRandomInt(boutonsBonusRares.length)
        ].style.display = "flex";
        bonusRareAffiche = 1;
      }
      for (let i = 0; i < totalBonusAffiches; i++) {
        let a = getRandomInt(boutonsBonus.length);
        boutonsBonus[a].style.display == "none"
          ? (boutonsBonus[a].style.display = "flex")
          : totalBonusAffiches++;
      }
    }
  }
  // sinon si on est lvl 1 on a le choix entre les classes
  else
    for (let i = 0; i < boutonsBonusClasses.length; i++) {
      boutonsBonusClasses[i].style.display = "flex";
    }
};

const removeClassesFromExcessBonus = () => {
  game.effets.forEach((eff) => {
    if (eff.nom == "Charognard") {
      document.getElementById("buttonCharo").parentElement.style.display =
        "none";
      document
        .getElementById("buttonCharo")
        .parentElement.classList.remove("bouton_bonus_rare");
    }
    if (eff.nom == "Attaques empoisonnées") {
      document.getElementById("buttonAttPois").parentElement.style.display =
        "none";
      document
        .getElementById("buttonAttPois")
        .parentElement.classList.remove("bouton_bonus_rare");
    }
  });
  if (player.sorts.length >= 10) {
    document.getElementById("buttonNouveauSortA").parentElement.style.display =
      "none";
    document
      .getElementById("buttonNouveauSortA")
      .parentElement.classList.remove("bouton_bonus");
    document.getElementById("buttonNouveauSortU").parentElement.style.display =
      "none";
    document
      .getElementById("buttonNouveauSortU")
      .parentElement.classList.remove("bouton_bonus");
  }
};

const getCoords = (elem) => {
  // crossbrowser version
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = (box.bottom - box.top) / 2 + box.top + scrollTop - clientTop;
  const left = (box.right - box.left) / 2 + box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
};

const initCdSorts = () => {
  //initialize spells cooldown for all entiies on the map
  tabCells.forEach((cel) => {
    if (contientEntite(cel)) {
      cel.contenu.resetcdSorts();
    }
  });
};

const isInSight = (posDep, posCible, posAIgnorer = 100) => {
  // checks line of sight

  const w = (e, t, n, r, posAIgnorer) => {
    (e = parseInt(e)), (t = parseInt(t));
    let o = (n = parseInt(n)) > e ? 1 : -1,
      a = (r = parseInt(r)) > t ? 1 : -1,
      s = !0,
      i = Math.abs(n - e),
      c = Math.abs(r - t),
      l = e,
      u = t,
      d = -1 + i + c,
      p = i - c;
    (i *= 2), (c *= 2);
    for (let m = 0; m < 1; m++)
      p > 0
        ? ((l += o), (p -= c))
        : p < 0
        ? ((u += a), (p += i))
        : ((l += o), (p -= c), (u += a), (p += i), d--);
    for (; d > 0 && s; )
      null != tabCells[u * 10 + l].contenu && u * 10 + l != posAIgnorer
        ? (s = !1)
        : (p > 0
            ? ((l += o), (p -= c))
            : p < 0
            ? ((u += a), (p += i))
            : ((l += o), (p -= c), (u += a), (p += i), d--),
          d--);
    return s;
  };

  return w(
    xFromPos(posDep),
    yFromPos(posDep),
    xFromPos(posCible),
    yFromPos(posCible),
    posAIgnorer,
  );
};

const estAPorteeDeDeplacement = (posdep, posarr, pm) => {
  //   on récupere les pos x et y
  let posx = xFromPos(posdep);
  let posy = yFromPos(posdep);

  let posxar = xFromPos(posarr);
  let posyar = yFromPos(posarr);

  let chemin = pathfinding(posx, posy, posxar, posyar);
  return chemin.length != 0 && chemin.length <= pm ? chemin : 0;
};

const pivoterEntite = (entite, posDir) => {
  // si il se dirige a gauche et que l'image est vers la droite
  if (
    xFromPos(posDir) < xFromPos(entite.pos()) &&
    entite.skin.includes("img/anime/side/")
  ) {
    entite.skin = entite.skin.replace("img/anime/side/", "img/anime/");
  }
  // a l'inverse si il se dirige a droite et que l'image est vers la gauche
  if (
    xFromPos(posDir) > xFromPos(entite.pos()) &&
    !entite.skin.includes("img/anime/side/")
  ) {
    entite.skin = entite.skin.replace("img/anime/", "img/anime/side/");
  }
};

const slowMo = async (chemin) => {
  for (let i = 0; i < chemin.length; i++) {
    await deplacerContenu(player.pos(), posFromxy(chemin[i][0], chemin[i][1]));
    player.PMact--;
  }
  game.phase = "TURN_PLAYER_MOVE";
  player.afficherStatsEntite();
};

const slowSort = async (cell) => {
  await cell.recevoirSort(player);
  // on verif qu'on est tjs en slowmo, car si on a tué le dernier ennemi on est passé en "MENU"
  if (game.phase == "SLOWMO_PLAYER") game.phase = "TURN_PLAYER_MOVE";
};

const coupCritique = (lanceur) => {
  // crit ou pas
  let crit = 1;
  if (randomInteger(0, 99) < lanceur.pourcentCrit) {
    crit = 1.5;
    ajouterAuChatType("Coup critique !", 0);
    anim_crit(lanceur);
  }
  return crit;
};

const calculDommages = (sort, Lanceur, dobase = null) => {
  let crit = coupCritique(Lanceur);
  let dommagesBase = Math.floor(
    Math.random() * (sort.baseDmgMax - sort.baseDmgMin + 1) + sort.baseDmgMin,
  );
  if (dobase) {
    dommagesBase = dobase;
  } // dobase permet de choisir les dommages de base a l'avance, utile pour dicethroww
  return Math.round(
    crit * dommagesBase * ((Lanceur.pourcentDo + 100) / 100) + Lanceur.bonusDo,
  );
};

const ajouterNouveauSort = (liste = listeSorts, sort = 0) => {
  if (!sort) {
    if (player.sorts.length < 10) {
      let sortAAjouter = liste[Math.floor(Math.random() * liste.length)];
      if (player.aDejaSort(sortAAjouter)) {
        ajouterNouveauSort(liste, sort);
      } else {
        player.sorts.push(sortAAjouter);
        initialisationSorts();
        addOnClicPrevisuSort();
      }
    }
  } else player.sorts.push(sort);
  initialisationSorts();
  addOnClicPrevisuSort();
};

const randomInteger = (min, max) =>
  Math.round(min - 0.5 + Math.random() * (max - min + 1));

const poidsSelonLevel = () => {
  game.poids = parseInt(game.level + 1);
};

const remplirSelonPoids = () => {
  let poidsTerrain = 0;
  let tropDuMeme = 0;
  let randoMob;
  let randoPos;
  let bossPose = 0;
  game.nbMobsGenerated = 0;

  if (game.poids >= gobpriest.poids + 10 && !listeMobs.includes(gobpriest)) {
    listeMobs.push(gobpriest);
  }

  tabBoss.forEach((boss) => {
    if (game.poids == boss.poids) {
      // round du boss
      while (!bossPose) {
        randoPos = randomInteger(40, 99);
        if (!contientEntite(tabCells[randoPos])) {
          tabCells[randoPos].contenu = boss.clone();
          bossPose = 1;
          game.nbMobsGenerated = 1;
        }
      }
    }
  });

  if (!bossPose) {
    while (poidsTerrain < game.poids) {
      randoMob = getRandomInt(listeMobs.length);
      randoPos = getRandomInt(100);

      if (
        contientEntite(tabCells[randoPos]) ||
        randoPos < 40 ||
        listeMobs[randoMob].poids <= game.poids / 10
      ) {
        continue;
      } else {
        tabCells[randoPos].contenu = listeMobs[randoMob].clone();
        poidsTerrain += listeMobs[randoMob].poids;
        let nBExemplaire = 0;
        game.nbMobsGenerated++;

        for (let i = 0; i < tabCells.length; i++) {
          if (
            contientEntite(tabCells[i]) &&
            tabCells[i].contenu.nom == listeMobs[randoMob].nom
          ) {
            nBExemplaire++;
            if (nBExemplaire > 2) {
              tropDuMeme = 1;
            }
          }
        }
      }
    }
    if (poidsTerrain > game.poids || tropDuMeme == 1) {
      viderBoard();
      ajouterJoueur();
      remplirSelonPoids();
    }
  }
};

const ajouterAuChatType = (ecriture, type) => {
  let status = document.getElementById("status");
  let statusenrobage = document.getElementById("statusenrobage");

  let t = document.createElement("p");
  t.innerText = ecriture;

  if (type == 0) {
    //description
    t.style.fontStyle = "italic";
    t.style.color = "#006600";
  }

  if (type == 1) {
    //injonction
    t.style.fontStyle = "bold";
    t.style.color = "#800000";
  }
  status.appendChild(t);

  //descend la scrolleuse
  statusenrobage.scrollTop = statusenrobage.scrollHeight;
};

const sleep = async (time) => {
  let a = new Promise((r) => setTimeout(r, time));
  await a;
  delete a;
};

const shuffle = (array) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

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
};
const triggerDommagesSubis = async (lanceur, cible) => {
  for (let i = 0; i < lanceur.effets.length; i++) {
    if (lanceur.effets[i].dommagesSubis) {
      await lanceur.effets[i].dommagesSubis(cible);
    }
  }
};

const triggeronKill = async (lanceur = player) => {
  for (let i = 0; i < lanceur.effets.length; i++) {
    if (lanceur.effets[i].onKill) {
      await lanceur.effets[i].onKill();
    }
  }
};
const triggeronDeath = async (entite) => {
  for (let i = 0; i < entite.effets.length; i++) {
    if (entite.effets[i].onDeath) {
      await entite.effets[i].onDeath();
    }
  }
};

const triggerDebutCombat = () => {
  for (let i = 0; i < game.effets.length; i++) {
    if (game.effets[i].debutCombat) {
      game.effets[i].debutCombat();
    }
  }
};

const scrollSkin = (dir, content = "skin") => {
  let record = loadRecord(); // return 0 si pas de record
  let nbKills = loadKills();
  let numSkinSelect = 0;
  let skinLocked = true;
  let numSkinSelectGround = 0;
  let skinLockedGround = true;

  for (let i = 0; i < listeSkins.length; i++) {
    // on retrouve quel skin est actuellement sélectionné
    if (listeSkins[i].select) {
      numSkinSelect = i;
    }
  }
  for (let i = 0; i < groundList.length; i++) {
    // on retrouve quel skin de map est actuellement sélectionné
    if (groundList[i].select) {
      numSkinSelectGround = i;
    }
  }

  if (content === "skin") {
    if (dir === "left") {
      //changement de skin select
      listeSkins[numSkinSelect].select = false;
      numSkinSelect--;
      if (numSkinSelect < 0) {
        numSkinSelect = listeSkins.length - 1;
      }
      listeSkins[numSkinSelect].select = true;
      //affichage
      document.getElementById(
        "divSkin",
      ).innerHTML = `<img class='chooseSkin' src = 
        ${listeSkins[numSkinSelect].lien} ></img>`;
      document.getElementById("divNomSkin").innerHTML =
        listeSkins[numSkinSelect].nom;
    } else {
      // fleche de droite
      //changement de skin select
      listeSkins[numSkinSelect].select = false;
      numSkinSelect++;
      if (numSkinSelect >= listeSkins.length) {
        numSkinSelect = 0;
      }
      listeSkins[numSkinSelect].select = true;
      //affichage
      document.getElementById(
        "divSkin",
      ).innerHTML = `<img class='chooseSkin' src = 
        ${listeSkins[numSkinSelect].lien} ></img>`;
      document.getElementById("divNomSkin").innerHTML =
        listeSkins[numSkinSelect].nom;
    }
  }
  if (content === "ground") {
    if (dir == "left") {
      //changement de skin select
      groundList[numSkinSelectGround].select = false;
      numSkinSelectGround--;
      if (numSkinSelectGround < 0) {
        numSkinSelectGround = groundList.length - 1;
      }
      groundList[numSkinSelectGround].select = true;

      //affichage
      document.getElementById("divSkinGround").innerHTML =
        `<img class='chooseSkinGround' src = ` +
        groundList[numSkinSelectGround].lien +
        `></img>`;
      document.getElementById("divNomSkinGround").innerHTML =
        groundList[numSkinSelectGround].nom;
    } else {
      // fleche de droite
      //changement de ground skin select
      groundList[numSkinSelectGround].select = false;
      numSkinSelectGround++;
      if (numSkinSelectGround >= groundList.length) {
        numSkinSelectGround = 0;
      }
      groundList[numSkinSelectGround].select = true;

      //affichage
      document.getElementById("divSkinGround").innerHTML =
        `<img class='chooseSkinGround' src = ` +
        groundList[numSkinSelectGround].lien +
        `></img>`;
      document.getElementById("divNomSkinGround").innerHTML =
        groundList[numSkinSelectGround].nom;
    }
  }
  // on vérifie qu'il a le level pour le nouveau skin
  record >= listeSkins[numSkinSelect].obtention
    ? (skinLocked = false)
    : (skinLocked = true);
  // affichage de la restriction de level ou du bouton
  if (skinLocked) {
    document.getElementById("divSkinObt").innerHTML =
      "Atteignez l'étage " +
      listeSkins[numSkinSelect].obtention +
      " pour le débloquer.";
    document.getElementById("boutonJouer").style.display = "none";
  } else {
    document.getElementById("divSkinObt").innerHTML = "";
    if (!skinLockedGround)
      document.getElementById("boutonJouer").style.display = "block";
  }
  // on vérifie qu'il a le level pour le nouveau skin de map
  nbKills >= groundList[numSkinSelectGround].obtention
    ? (skinLockedGround = false)
    : (skinLockedGround = true);
  // affichage de la restriction de level ou du bouton
  if (skinLockedGround) {
    document.getElementById("divSkinObtGround").innerHTML =
      "Tuez " +
      groundList[numSkinSelectGround].obtention +
      " ennemis au total pour le débloquer. Actuellement : " +
      nbKills +
      ".";
    document.getElementById("boutonJouer").style.display = "none";
  } else {
    document.getElementById("divSkinObtGround").innerHTML = "";
    if (!skinLocked)
      document.getElementById("boutonJouer").style.display = "block";
  }
};

const onClicJouer = () => {
  let record = loadRecord(); // return 0 si pas de record
  let nbKills = loadKills();
  let numSkinSelect = 0;

  for (let i = 0; i < listeSkins.length; i++) {
    // on retrouve quel skin est actuellement sélectionné
    if (listeSkins[i].select === true) {
      numSkinSelect = i;
    }
  }
  for (let i = 0; i < groundList.length; i++) {
    // on retrouve quel skin de map est actuellement sélectionné
    if (groundList[i].select === true) {
      numSkinSelectGround = i;
    }
  }

  // on vérifie qu'il a le level pour le skin
  if (record >= listeSkins[numSkinSelect].obtention) {
    player.skin = listeSkins[numSkinSelect].lien.replace(
      "img/skins/",
      "img/anime/skins/",
    );
  }
  // sauvegarde du player et affichage du skin
  playerSave = Object.assign({}, player);
  refreshBoard();

  // on vérifie qu'il a les kills pour le skin de map
  if (nbKills >= groundList[numSkinSelectGround].obtention) {
    document
      .getElementById("board")
      .classList.add(groundList[numSkinSelectGround].class);
    game.map = groundList[numSkinSelectGround].class;
  }
};

const afficherModalSkin = () => {
  if (game.level == 0) {
    if (window.innerHeight > window.innerWidth) {
      // alert("Le jeu est fait pour être joué en mode paysage, tourne ton téléphone ;)");
      $(`#modalPortrait`).modal();
    }
    $(`#modalChooseSkin`).modal();
  }
};

const preloadImage = (url) => {
  let img = new Image();
  img.src = url;
};

const preloadAllImages = () => {
  listeEntitesNonJoueur.forEach((entite) => {
    // on les load à l'endroit et à l'envers
    preloadImage(entite.skin);
    entite.skin = entite.skin.replace("img/anime/", "img/anime/side/");
    preloadImage(entite.skin);
    entite.skin = entite.skin.replace("img/anime/side/", "img/anime/");
  });
  listeSorts.forEach((spell) => {
    if (spell.animation) preloadImage(spell.animation.path);
  });
  for (let i = 1; i < 7; i++) {
    preloadImage("img/dices/" + i + ".png");
  }
  for (let i = 1; i < 5; i++) {
    preloadImage("img/crit" + i + ".png");
  }
};
