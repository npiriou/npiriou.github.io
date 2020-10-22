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

mapRoulette = new sort("MAPROULETTE", "Map Roulette", 1, 0, 0, 0, 0, 0, "Aucune", "Case", 1, pasdEffet, 0,0,1, "", "Sort du boss");
carterie = new sort("CARTERIE", "Carterie", 3, 0, 0, 1, 5, 1, "Aucune", "Case", 1, pasdEffet, 0,0,0,"", "Sort du boss");


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
Maneki = new entite("Maneki Neko", 8, 4, 150, 0, [carterie, mapRoulette], "ENEMY", iaManeki, 0, 0, "img/Maneki.png", 15);


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
carterie.effetCell = function (cell, lanceur) {
    // roll carte et tape ou heal
    let deck = ['s', 'd', 'h', 'c'];
    if (this.blackonly) {
        deck = ['s', 'c'];
    }
    
    let dommages = 1 + getRandomInt(10);
    let carte = deck[Math.floor(Math.random() * deck.length)];
    let img = 'img/maneki/' + (dommages).toString() + carte + '.svg';
    splash_projectile($("#"+lanceur.pos())[0], $("#"+cell.posNum)[0], { path: img, width: 50, height: 70, nb: 1 });
    if (!estVide(cell)) {
        if (carte == 'h' || carte == 'd') {
            cell.contenu.ajouterPVs(dommages); // heal
        } else {
            cell.contenu.retirerPVs(dommages);
        }
    }
    return 0;
};

mapRoulette.effetCell = function (cell, lanceur) {
    let cercle = [22, 72, 77, 27];
    
    let killobstacle = 0;
    let effet = getRandomInt(4);
    let text_delay = 1000;
    // Si premier lancement on place le glyphe et on fait tourner la roue
    if (!this.premierLancementEffectue) {
        killobstacle = 1;
        this.actifs = ['degat', 'po', 'pm', 'chance'];
        shuffle(this.actifs);
        this.premierLancementEffectue = 1;
        let i = 0;
        cercle.forEach(index => {
            // on tue les neutrals deja bien places :D
            if (killobstacle && tabCells[index].contenu && tabCells[index].contenu.side == "NEUTRAL") {
                tabCells[index].contenu.mort();
            }
            tabCells[index].ajouterGlyphe(lanceur, 1000, null, `img/maneki/${this.actifs[i]}.png`);
            i++;
        });
        // premier coup, tourne la map
        splash_img(document.getElementById(22), {path: "img/maneki/arrow.png", width:50, height: 50, timeout: 3000, nofade: 1});
        divBoard.style.transitionDuration = "2s";
        divBoard.style.transitionProperty = "transform";
        divBoard.style.transform = "rotate(" + (effet * 90 + 360) + "deg)";

        setTimeout(() => {
            divBoard.style.transitionDuration = "200ms";
            divBoard.style.transitionProperty = "transform";
            divBoard.style.transform = "rotate(0deg)";
        }, 3000);
        text_delay = 3000;
    } else { // sinon on fait juste tourner la fleche
        if (this.remettrePO) {
            player.POBonus += 5;
            this.remettrePO = 0;
        } 
        carterie.blackonly = 0;
        
        for (let i = 0; i < 8 + effet; i++) {
            setTimeout(() => splash_img(document.getElementById(cercle[i%4]), {path: "img/maneki/arrow.png", width:50, height: 50, timeout: 100}), i*100);
        }
        setTimeout(() => splash_img(document.getElementById(cercle[effet]), {path: "img/maneki/arrow.png", width:50, height: 50, timeout: 500}), 800+effet*100);
    }
    // si quelqu un sur la cell, on annule l'effet
    if (tabCells[cercle[effet]].contenu) {
        setTimeout(() => ajouterAuChatType("La roulette a rencontré un obstacle, vous êtes chanceux!", 1), text_delay);
        return 0;
    }

    // tableau des effets
    switch (this.actifs[effet]) {
        case "degat":
            setTimeout(() => ajouterAuChatType("La roulette n'est pas en votre faveur, vous perdez 50% de votre vie!", 0), text_delay);
            player.PVact -= player.PVact / 2;
            player.PVact = Math.round(player.PVact); // arrondi superieur la chance
            break;
        case "po":
            setTimeout(() => ajouterAuChatType("La roulette n'est pas en votre faveur, vous perdez 5 de portée!", 0), text_delay);
            player.POBonus -= 5;
            this.remettrePO = 1;
            break;
        case "pm":
            setTimeout(() => ajouterAuChatType("La roulette n'est pas en votre faveur, vous perdez 2 point de mouvement!", 0), text_delay);
            player.PMact -= 2;
            break;
        case "chance":
            setTimeout(() => ajouterAuChatType("La roulette n'est pas en votre faveur, Maneki ne tire plus de carte rouges!", 0), text_delay);
            carterie.blackonly = 1;
            break;

    }

    return 0;
};

fireball.animation = { path: "img/anim_fireball.png", width: 50, height: 50, nb: 1 };
missile.animation = { path: "img/anim_missile.png", width: 50, height: 50, nb: 1 };
pression.animation = { path: "img/anim_swords.png", width: 50, height: 50, nb: 1 };
