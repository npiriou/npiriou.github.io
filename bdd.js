effetBoostDo = function (entite) {
    entite.ajouterDo(this.valeurEffet);
    return 0;
}
effetSoin = function (entite) {
    entite.ajouterPVs(this.valeurEffet);
    ajouterAuChatType(entite.nom + " gagne " + this.valeurEffet + " PV", 0);
    return 0;
}

effetTP = function (cell) {
    if (estVide(cell)) {
        let posLanceur;
        if (game.phase.includes("TURN_PLAYER")) posLanceur = player.pos();
        else if (!game.phase.includes("TURN_PLAYER")) posLanceur = game.mobActif.pos();
        splash_flash( document.getElementById(posLanceur));
        splash_flash( document.getElementById(cell.posNum));
        deplacerContenuInstantane(posLanceur, cell.posNum);
    }
    else { ajouterAuChatType("on ne peut pas se teleporter sur une case ou il y a déjà quelqu'un, gros noob !", 0); }
    return 0;
}

effetInvoc = function (cell) {
    if (estVide(cell)) {
        cell.contenu = ogreInvoque.clone();
        cell.contenu.invocation = 1;
        if (game.phase.includes("TURN_PLAYER")) cell.contenu.side = "ALLY";
        else if (!game.phase.includes("TURN_PLAYER")) cell.contenu.side = "ENEMY";
        refreshBoard();

    }
    else { ajouterAuChatType("on ne peut pas invoquer sur une case ou il y a déjà quelqu'un, gros noob !", 0); }
    return 0;
}

effetBoite = function (cell) {
    if (estVide(cell)) {
        cell.contenu = boite.clone();
        cell.contenu.invocation = 1;
        cell.contenu.side = "NEUTRAL";
        refreshBoard();

    }
    else { ajouterAuChatType("on ne peut pas invoquer sur une case ou il y a déjà quelqu'un, gros noob !", 0); }
    return 0;
}



effetDes = function (cell, lanceur) {     // roll carte et tape ou heal     
  
    let dommagesBase = getRandomInt(6)+1;
    let dommages = Math.round(dommagesBase * ((lanceur.pourcentDo + 100) / 100) + lanceur.bonusDo);

    let img = 'img/dices/' + (dommagesBase).toString() +  '.png';
    splash_projectile($("#"+lanceur.pos())[0], $("#"+cell.posNum)[0], { path: img, width: 50, height: 50, nb: 1 });
 
    if (!estVide(cell)) {
        cell.contenu.retirerPVs(dommages);
    } else { ajouterAuChatType("Le dé part dans le vide", 0) }
    return 0;
}

pasdEffet = function () { return 1; }

// sort(code, nom, coutPA, baseDmgMin, baseDmgMax, porteeMin, porteeMax, POModif, zoneLancer, AoE, LdV, 
//       effet, valeurEffet, dureeEffet, cooldown, logo, description)
pression = new sort("PRESSION", "Pression", 4, 7, 9, 1, 2, 0, "Aucune", "Case", 1, pasdEffet, 0, 0, 0, "img/pression.jpg", "Envoie un bon coup d'épée");
cac = new sort("CAC", "Attaque au CaC", 3, 3, 4, 1, 1, 0, "Aucune", "Case", 1, pasdEffet, 0, 0, 0, "img/cac.png", "Met une bonne patate à la cible");
missile = new sort("MISSILE", "Missile", 4, 3, 4, 4, 10, 1, "Aucune", "Case", 0, pasdEffet, 0, 0, 0, "img/missile.png", "Tire un missile sans ligne de vue");
rage = new sort("RAGE", "Rage", 4, 0, 0, 0, 0, 0, "Aucune", "Case", 1, effetBoostDo, 2, 2, 3, "img/rage.png", "Augmente ses dommages de 2");
fireball = new sort("FIREBALL", "Boule de feu", 5, 8, 12, 2, 5, 1, "Aucune", "Case", 1, pasdEffet, 0, 0, 0, "img/fireball.png", "Une boule de feu tout ce qu'il y a de plus classique");
mjtp = new sort("mjtp", "mjtp", 0, 0, 0, 1, 1000, 0, "Aucune", "Case", 0, effetTP, 0, 0, 0, "img/tp.jpg", "Téléporte. Faites le en direction des ennemis pour un effet de surprise !");
mjdoom = new sort("DOOM", "Doom", 0, 1000, 1000, 0, 100, 1, "Aucune", "Case", 0, pasdEffet, 0, 0, 0, "img/doom.jpg", "BOOOOOM");
gifle = new sort("GIFLE", "Gifle", 2, 2, 3, 1, 1, 0, "Aucune", "Case", 1, pasdEffet, 0, 0, 0, "img/gifle.png", "Met une petite claque humiliante à la cible");
pansements = new sort("PANSEMENTS", "Pansements", 4, 0, 0, 0, 0, 1, "Aucune", "Case", 1, effetSoin, 10, 0, 1000, "img/pansement.png", "Un petit pansement et ça va mieux, soigne de 10 PV");
ecrasement = new sort("ECRASEMENT", "Ecrasement", 6, 15, 30, 2, 2, 0, "Aucune", "Case", 1, pasdEffet, 0, 0, 0, "img/hammer.png", "Aïe, ça doit faire mal");
flash = new sort("FLASH", "Flash", 1, 0, 0, 1, 2, 0, "Aucune", "Case", 0, effetTP, 0, 0, 6, "img/flash.png", "Téléporte. Faites le en direction des ennemis pour un effet de surprise !");
invoquerOgre = new sort("INVOC_OGRE", "Invocation d'Ogre", 6, 0, 0, 1, 1, 1, "Aucune", "Case", 1, effetInvoc, 0, 0, 10, "img/invoc.jpg", "Invoque un Ogre affamé");
mjposerBoite = new sort("mjposerboite", "mjposerboite", 0, 0, 0, 1, 1000, 0, "Aucune", "Case", 0, pasdEffet, 0, 0, 0, "img/boite.png", "Pose une boite");
poserBoite = new sort("POSER_BOITE", "Invocation de boite", 3, 0, 0, 1, 5, 1, "Aucune", "Case", 0, pasdEffet, 0, 0, 2, "img/boite.png", "Pose une boite");
diceThrow = new sort("DICETHROW", "Lancé de dé", 3, 1, 6, 1, 6, 1, "Aucune", "Case", 1, pasdEffet, 0, 0, 0, "img/dice.png", "Faites parler votre skill");


var listeSorts = [pression, cac, missile, rage, fireball, pansements, ecrasement, flash, invoquerOgre, poserBoite];

// Entites  nom, PAmax, PMmax, PVmax, POBonus, sorts, side, ia, bonusDo, pourcentDo, skin, poids
player = new entite("Player", 6, 3, 50, 0, [cac], "ALLY", null, 0, 0, "img/player.png", 0); // player

mannequin = new entite("Mannequin", 4, 1, 10, 0, [cac], "ENEMY", iaDebile, 0, 0, "img/mannequin.png", 1);
ogre = new entite("Ogre", 9, 2, 50, 0, [cac, rage], "ENEMY", iaDebile, 0, 0, "img/ogre.png", 3);
orc = new entite("Orc", 7, 3, 30, 0, [cac, pression], "ENEMY", iaDebile, 0, 0, "img/orc.png", 5);
artillerie = new entite("Artillerie", 8, 1, 30, 0, [missile], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/arti.png", 7);
sorcier = new entite("Puissant Sorcier", 10, 3, 25, 0, [fireball], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/wizard.png", 9);
gobelin = new entite("Gobelin", 4, 5, 12, 0, [gifle], "ENEMY", iaDebile, 0, 0, "img/gobelin.png", 2);
nain = new entite("Nain", 7, 3, 40, 0, [ecrasement], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/nain.png", 6);
apprentiSorcier = new entite("Apprenti sorcier", 3, 2, 15, 0, [diceThrow], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/petitmage.png", 3);
chien = new entite("Chien zombie", 8, 4, 30, 0, [cac, flash, rage], "ENEMY", iaDebile, 0, 0, "img/chien.png", 8);


boite = new entite("Boite", 0, 0, 10, 0, [], "NEUTRAL", null, 0, 0, "img/box.png", 0);
ogreInvoque = new entite("Ogre Invoqué", 6, 2, 30, 0, [cac], "ALLY", iaDebile_ALLY, 0, 0, "img/ogre2.png", 0);


var listeMobs = [mannequin, ogre, orc, artillerie, sorcier, gobelin, nain, apprentiSorcier, chien];



//gitaneries obligatoire thx mastho
flash.effetCell = effetTP;
mjtp.effetCell = effetTP;
invoquerOgre.effetCell = effetInvoc;
mjposerBoite.effetCell = effetBoite;
poserBoite.effetCell = effetBoite;
diceThrow.effetCell = effetDes;


fireball.animation = { path: "img/anim_fireball.png", width: 50, height: 50, nb: 1 };
missile.animation = { path: "img/anim_missile.png", width: 50, height: 50, nb: 1 };
pression.animation = { path: "img/anim_swords.png", width: 50, height: 50, nb: 1 };
