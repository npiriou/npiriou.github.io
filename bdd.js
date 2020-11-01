effetBoostDo = function (entite) {
    entite.ajouterDo(this.nom, this.valeurEffet, this.dureeEffet);
    return 0;
}
effetBoostPCDo = function (entite) {
    entite.ajouterPCDo(this.nom, this.valeurEffet, this.dureeEffet);
    return 0;
}

effetPoison = function (entite) {
    let Lanceur;
    if (!game.mobActif) Lanceur = player;
    else Lanceur = game.mobActif;

    entite.poison(this.nom, this.valeurEffet, this.dureeEffet, Lanceur);
    return 1;
}

effetSoin = function (entite) {
    entite.ajouterPVs(this.valeurEffet);
    ajouterAuChatType(entite.nom + " gagne " + this.valeurEffet + " PV", 0);
    return 0;
}

effetTP = function (cell) {
    if (estVide(cell)) {
        let posLanceur;
        if (!game.mobActif) posLanceur = player.pos();
        else posLanceur = game.mobActif.pos();
        splash_flash(document.getElementById(posLanceur));
        splash_flash(document.getElementById(cell.posNum));
        deplacerContenuInstantane(posLanceur, cell.posNum);
    }
    else { ajouterAuChatType("on ne peut pas se teleporter sur une case ou il y a déjà quelqu'un, gros noob !", 0); }
    return 0;
}

effetSwap = function (entite) {
    let posLanceur;
    let posEntite = entite.pos();
    let contenuStocke = entite;
    if (!game.mobActif) posLanceur = player.pos();
    else posLanceur = game.mobActif.pos();
    splash_flash(document.getElementById(posLanceur));
    splash_flash(document.getElementById(posEntite));
    tabCells[entite.pos()].contenu = null;
    deplacerContenuInstantane(posLanceur, posEntite);
    tabCells[posLanceur].contenu = contenuStocke;
    refreshBoard();
    return 0;
}


effetInvocOgre = function (cell) {
    if (estVide(cell)) {
        cell.contenu = ogreInvoque.clone();
        cell.contenu.invocation = 1;
        if ((!game.mobActif)) cell.contenu.side = "ALLY";
        else cell.contenu.side = "ENEMY";
        splash_invo(document.getElementById(cell.posNum));
        refreshBoard();
    }
    else { ajouterAuChatType("on ne peut pas invoquer sur une case ou il y a déjà quelqu'un, gros noob !", 0); }
    return 0;
}
effetInvocKang = function (cell) {
    if (estVide(cell)) {
        cell.contenu = kangInvoque.clone();
        cell.contenu.invocation = 1;
        if ((!game.mobActif)) cell.contenu.side = "ALLY";
        else cell.contenu.side = "ENEMY";
        splash_invo(document.getElementById(cell.posNum));
        refreshBoard();
    }
    else { ajouterAuChatType("on ne peut pas invoquer sur une case ou il y a déjà quelqu'un, gros noob !", 0); }
    return 0;
}

effetInvocGob = function (cell) {
    if (estVide(cell)) {
        cell.contenu = gobelin.clone();
        cell.contenu.invocation = 1;
        if ((!game.mobActif)) cell.contenu.side = "ALLY";
        else cell.contenu.side = "ENEMY";
        splash_invo(document.getElementById(cell.posNum));
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



effetDes = async function (cell, lanceur) {     // roll carte et tape ou heal     

    let dommagesBase = getRandomInt(6) + 1;

    let img = 'img/dices/' + (dommagesBase).toString() + '.png';
    splash_projectile($("#" + lanceur.pos())[0], $("#" + cell.posNum)[0], { path: img, width: 50, height: 50, nb: 1 });

    if (!estVide(cell)) {
        cell.contenu.retirerPVs(calculDommages(this, lanceur, dommagesBase));
        if (entite) await triggerDommagesSubis(lanceur, cell.contenu);
    } else { ajouterAuChatType("Le dé part dans le vide", 0) }
    return 0;
}

effetPoussee = async function (entite) {
    let Lanceur;
    if (!game.mobActif) Lanceur = player;
    else Lanceur = game.mobActif;
    await entite.pousser(this.valeurEffet, Lanceur.pos());
    if (this.baseDmgMax > 0) return 1; else return 0;
}
effetGrab = async function (entite) {
    let Lanceur;
    if (!game.mobActif) Lanceur = player;
    else Lanceur = game.mobActif;
    await entite.grab(this.valeurEffet, Lanceur.pos());
    if (this.baseDmgMax > 0) return 1; else return 0;
}
effetPMInstant = function (entite, valeur = this.valeurEffet) {// entite : la cible, valeur : pm perdus(max)
    let add;
    // selon effet negatif ou positif cest assez chiant plein de trucs a changer
    valeur < 0 ? add = randomInteger(valeur, 0) : add = Math.max(getRandomInt(valeur), 1);

    if (add < 0 && Math.abs(add) > entite.PMact) add = 0 - entite.PMact; // on ne peut pas retirer plus que ce qu'il a

    if (entite.PMact > 0 || add > 0) {
        entite.PMact += add;
        let celltarget = document.getElementById(entite.pos());

        if (add != 0) {
            if (add > 0) {
                splash_pm(celltarget, " + " + add + " PM");
                ajouterAuChatType(entite.nom + " gagne " + add + " PM.", 0);
            }
            else {
                splash_pm(celltarget, add + " PM");
                ajouterAuChatType(entite.nom + " perd " + Math.abs(add) + " PM.", 0);
            }
        }
    }
    if (this.baseDmgMax > 0) return 1; else return 0;
}
effetPAInstant = function (entite, valeur = this.valeurEffet) {
    let add;
    // selon effet negatif ou positif cest assez chiant plein de trucs a changer
    valeur < 0 ? add = randomInteger(valeur, 0) : add = getRandomInt(valeur);

    if (add < 0 && Math.abs(add) > entite.PAact) add = 0 - entite.PAact; // on ne peut pas retirer plus que ce qu'il a

    if (entite.PAact > 0 || add > 0) {
        entite.PAact += add;
        let celltarget = document.getElementById(entite.pos());

        if (add != 0) {
            if (add > 0) {
                splash_PA(celltarget, " + " + add + " PA");
                ajouterAuChatType(entite.nom + " gagne " + add + " PA.", 0);
            }
            else {
                splash_PA(celltarget, add + " PA");
                ajouterAuChatType(entite.nom + " perd " + Math.abs(add) + " PA.", 0);
            }
        }
    }
    if (this.baseDmgMax > 0) return 1; else return 0;
}

effetFilet = async function (cell) { // retire PM et repousse le lanceur dans la direction inverse
    // valeurEffet est a la fois le nb de cases de poussee et le max de PM retires pour plus de spaghettis   
    let Lanceur;
    if (!game.mobActif) Lanceur = player;
    else Lanceur = game.mobActif;
    splash_projectile($("#" + Lanceur.pos())[0], $("#" + cell.posNum)[0], { path: "img/anim_net.png", width: 70, height: 70, nb: 1 });

    if (cell.contenu) { // si y'a un contenu on lui envoie des degats
        effetPMInstant(cell.contenu, -(this.valeurEffet));
        cell.contenu.retirerPVs(calculDommages(this, Lanceur));
        if (entite) await triggerDommagesSubis(Lanceur, cell.contenu);
    }
    await Lanceur.pousser(this.valeurEffet, cell.posNum);
    return 0;
}


pasdEffet = function () { return 1; }

// sort(code, nom, coutPA, baseDmgMin, baseDmgMax, porteeMin, porteeMax, POModif, zoneLancer, AoE, LdV, 
//       effet, valeurEffet, dureeEffet, cooldown, logo, description)
pression = new sort("PRESSION", "Pression", 3, 5, 7, 1, 2, 0, null, "Case", 1, pasdEffet, 0, 0, 0, "img/pression.jpg", "Envoie un bon coup d'épée");
cac = new sort("CAC", "Attaque au CaC", 3, 3, 4, 1, 1, 0, null, "Case", 1, pasdEffet, 0, 0, 0, "img/cac.png", "Met une bonne patate à la cible");
missile = new sort("MISSILE", "Missile", 4, 3, 4, 4, 10, 1, null, "Case", 0, pasdEffet, 0, 0, 0, "img/missile.png", "Tire un missile sans ligne de vue");
rage = new sort("RAGE", "Rage", 2, 0, 0, 0, 0, 0, null, "Case", 1, effetBoostDo, 5, 3, 3, "img/rage.png", "Augmente les dommages de 5 pour 3 tours");
fireball = new sort("FIREBALL", "Boule de feu", 5, 8, 12, 2, 4, 1, null, "Case", 1, pasdEffet, 0, 0, 0, "img/fireball.png", "Une boule de feu tout ce qu'il y a de plus classique");
mjtp = new sort("MJTP", "mjtp", 0, 0, 0, 1, 1000, 0, null, "Case", 0, effetTP, 0, 0, 0, "img/tp.jpg", "Téléporte. Faites le en direction des ennemis pour un effet de surprise !");
mjdoom = new sort("DOOM", "Doom", 0, 1000, 1000, 0, 100, 1, null, "Case", 0, pasdEffet, 0, 0, 0, "img/doom.jpg", "BOOOOOM");
gifle = new sort("GIFLE", "Gifle", 1, 1, 1, 1, 1, 0, null, "Case", 1, pasdEffet, 0, 0, 0, "img/gifle.png", "Met une petite claque humiliante à la cible");
pansements = new sort("PANSEMENTS", "Pansements", 4, 0, 0, 0, 0, 1, null, "Case", 1, effetSoin, 10, 0, 1000, "img/pansement.png", "Un petit pansement et ça va mieux, soigne de 10 PV");
ecrasement = new sort("ECRASEMENT", "Ecrasement", 6, 15, 30, 2, 2, 0, null, "Case", 1, pasdEffet, 0, 0, 0, "img/hammer.png", "Aïe, ça doit faire mal");
flash = new sort("FLASH", "Flash", 1, 0, 0, 1, 2, 0, null, "Case", 0, effetTP, 0, 0, 6, "img/flash.png", "Téléporte. Faites le en direction des ennemis pour un effet de surprise !");
invoquerOgre = new sort("INVOC_OGRE", "Invocation d'Ogre", 6, 0, 0, 1, 1, 1, null, "Case", 1, effetInvocOgre, 0, 0, 10, "img/invoc.jpg", "Invoque un Ogre affamé");
invoquerKang = new sort("INVOC_Kang", "Invocation de Chevre", 5, 0, 0, 1, 1, 1, null, "Case", 1, effetInvocKang, 0, 0, 6, "img/goatspell.png", "Invoque une chevre qui pousse les ennemis");
mjposerBoite = new sort("MJPOSERBOITE", "mjposerboite", 0, 0, 0, 1, 1000, 0, null, "Case", 0, pasdEffet, 0, 0, 0, "img/boite.png", "Pose une boite");
poserBoite = new sort("POSER_BOITE", "Invocation de boite", 3, 0, 0, 1, 5, 1, null, "Case", 0, pasdEffet, 0, 0, 2, "img/boite.png", "Pose une boite");
diceThrow = new sort("DICETHROW", "Lancé de dé", 3, 1, 6, 1, 6, 1, null, "Case", 1, pasdEffet, 0, 0, 0, "img/dice.png", "Faites parler votre skill");
feuint = new sort("FEU_INTERIEUR", "Feu intérieur", 2, 0, 0, 0, 0, 0, null, "Case", 1, effetBoostPCDo, 75, 2, 3, "img/feuint.png", "Augmente les % dommages de 75 pour 2 tours");
poisonflech = new sort("FLECHETTE", "Fléchette empoisonnée", 4, 4, 5, 1, 4, 1, "Ligne", "Case", 0, effetPoison, 5, 2, 0, "img/dart.png", "Une flechette qui empoisonne de 5 pendant deux tours");
kick = new sort("KICK", "High Kick", 3, 8, 10, 1, 1, 0, "Ligne", "Case", 1, effetPoussee, 3, 0, 0, "img/kick.png", "Repousse la cible de trois cases");
grab = new sort("GRAB", "Grab", 3, 5, 7, 2, 7, 0, "Ligne", "Case", 1, effetGrab, 5, 0, 2, "img/grab.png", "Attire la cible de 5 cases");
toile = new sort("TOILE", "Toile", 1, 0, 0, 2, 7, 1, null, "Case", 1, effetPMInstant, -2, 0, 0, "img/toile.png", "Ne fais pas de dégâts, mais retire jusqu'à 2 PM à la cible");
pasltime = new sort("PASLTIME", "Pas l'time", 4, 8, 10, 2, 6, 1, "Ligne", "Case", 1, effetPAInstant, -3, 0, 0, "img/pasltime.png", "Distord la temporalité pour retirer jusqu'à 3 PA à la cible");
sprint = new sort("SPRINT", "Sprint", 2, 0, 0, 0, 3, 1, null, "Case", 1, effetPMInstant, 4, 0, 4, "img/sprint.jpg", "La fuite, la fuite !");
vague = new sort("VAGUE", "Vague déferlante", 5, 12, 20, 1, 3, 1, "Ligne", "Case", 1, effetPoussee, 2, 0, 0, "img/vague.png", "Envoie une vague qui repousse la cible de deux cases, contrairement à d'autres");
filet = new sort("FILET", "Filet", 4, 5, 7, 1, 3, 0, "Ligne", "Case", 1, effetFilet, 2, 0, 1, "img/net.png", "Retire jusqu'à 2 PM et repousse le lanceur dans la direction inverse");
echange = new sort("ECHANGE", "Echange", 4, 0, 0, 1, 3, 0, null, "Case", 0, effetSwap, 0, 0, 3, "img/swap.png", "Échange de place avec la cible");
toilecd = new sort("TOILECD", "Toile de petite araignée", 1, 0, 0, 2, 7, 1, null, "Case", 1, effetPMInstant, -2, 0, 1, "img/toile.png", "Ne fais pas de dégâts, mais retire jusqu'à 2 PM à la cible");

// boostpo

mapRoulette = new sort("MAPROULETTE", "Map Roulette", 1, 0, 0, 0, 0, 0, null, "Case", 1, pasdEffet, 0, 0, 1, "", "Sort du boss");
carterie = new sort("CARTERIE", "Carterie", 3, 0, 0, 1, 5, 1, null, "Case", 1, pasdEffet, 0, 0, 0, "", "Sort du boss");
invoquerGobelin = new sort("INVOC_GOB", "Invocation de Gobelin", 4, 0, 0, 1, 1, 1, null, "Case", 1, effetInvocGob, 0, 0, 0, "img/invoc.jpg", "Invoque un Gobelin affamé");
soingob = new sort("SOIN_GOB", "Soin gobelesque", 4, 0, 0, 0, 0, 1, null, "Case", 1, effetSoin, 20, 0, 4, "img/pansement.png", "Sort du boss");


var listeSorts = [pression, cac, missile, rage, fireball, pansements, diceThrow, ecrasement, flash, invoquerOgre, invoquerKang, poserBoite, feuint, poisonflech, kick, toile, pasltime, sprint, vague, filet,  echange];
var listeSortsAttaque = [pression, missile, fireball, diceThrow, ecrasement, poisonflech, kick, pasltime, vague];
var listeSortsUtil = [rage, pansements, flash, invoquerOgre, invoquerKang, poserBoite, feuint, toile, sprint, filet,  echange];


// Entites  nom, PAmax, PMmax, PVmax, POBonus, sorts, side, ia, bonusDo, pourcentDo, skin, poids
player = new entite("Player", 6, 3, 50, 0, [cac], "ALLY", null, 0, 0, "img/anime/skins/WitchHuntersLeader.png", 0); // player

mannequin = new entite("Mannequin", 4, 1, 10, 0, [cac], "ENEMY", iaDebile, 0, 0, "img/mannequin.png", 1);
ogre = new entite("Ogre", 9, 2, 50, 0, [cac, rage], "ENEMY", iaDebile, 0, 0, "img/anime/Forest Ogre Orkgre.png", 3);
orc = new entite("Orc", 7, 3, 30, 0, [cac, pression], "ENEMY", iaDebile, 0, 0, "img/anime/Orc Axe Warrior.png", 5);
artillerie = new entite("Artillerie", 8, 1, 30, 0, [missile], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/anime/Machines Fantasy Tank A.png", 7);
sorcier = new entite("Sorcier", 10, 3, 25, 0, [fireball], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/anime/Aspiring Knight Palazo.png", 9);
gobelin = new entite("Gobelin", 4, 5, 12, 0, [gifle], "ENEMY", iaDebile, 0, 0, "img/anime/Goblin Grunt.png", 2);
nain = new entite("Nain", 9, 3, 40, 0, [ecrasement, cac, feuint], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/anime/nain.png", 6);
apprentiSorcier = new entite("Apprenti sorcier", 3, 2, 15, 0, [diceThrow], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/anime/Boss Spirit Fighter.png", 3);
chien = new entite("Chien zombie", 10, 4, 35, 0, [cac, flash, rage], "ENEMY", iaDebile, 0, 0, "img/anime/Boss Hellhound Garm.png", 8);
bot = new entite("Mysterieux robot", 10, 3, 100, 0, [grab, cac], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/bot.png", 9)
ranger = new entite("Dryade", 8, 4, 95, 0, [poisonflech], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/anime/Dryads Archer.png", 17);
minorspider = new entite("Petite Araignée", 5, 3, 15, 0, [toilecd, cac], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/anime/Forest Red Spider.png", 2);
sirene = new entite("Sirène", 8, 4, 125, 0, [vague, feuint], "ENEMY", iaRangeMoinsDebile, 0, 0, "img/anime/Boss Sea Mermaid Warrior Undeen.png", 14);

//boss
Maneki = new entite("Maneki Neko", 8, 4, 150, 0, [carterie, mapRoulette], "ENEMY", iaManeki, 0, 0, "img/anime/Maneki.png", 11);
gobpriest = new entite("Prêtresse", 10, 5, 200, 0, [pression, invoquerGobelin, rage, soingob], "ENEMY", iaBossGob, 0, 0, "img/anime/Orc Warlock Weak.png", 21);

// invocs et neutrals
boite = new entite("Tonneau", 0, 0, 10, 0, [], "NEUTRAL", null, 0, 0, "img/tonneau.png", 0);
ogreInvoque = new entite("Ogre Invoqué", 9, 2, 50, 0, [cac, rage], "ALLY", iaDebile_ALLY, 0, 0, "img/anime/Forest Ogre Orkgre.png", 0);
kangInvoque = new entite("Chèvre Invoquée", 6, 3, 35, 0, [kick], "ALLY", iaDebile_ALLY, 0, 0, "img/anime/Mountain Greathorn Goat.png", 0);


var listeMobs = [mannequin, ogre, orc, artillerie, sorcier, gobelin, nain, apprentiSorcier, chien, bot, ranger, minorspider, sirene];



//gitaneries obligatoire pour lancer sort sur cell vide
flash.effetCell = effetTP;
mjtp.effetCell = effetTP;
invoquerOgre.effetCell = effetInvocOgre;
invoquerKang.effetCell = effetInvocKang;
mjposerBoite.effetCell = effetBoite;
poserBoite.effetCell = effetBoite;
diceThrow.effetCell = effetDes;
invoquerGobelin.effetCell = effetInvocGob;
filet.effetCell = effetFilet;

fireball.animation = { path: "img/anim_fireball.png", width: 50, height: 50, nb: 1 };
missile.animation = { path: "img/anim_missile.png", width: 50, height: 50, nb: 1 };
pression.animation = { path: "img/anim_swords.png", width: 50, height: 50, nb: 1 };
poisonflech.animation = { path: "img/anim_dart.png", width: 50, height: 50, nb: 1 };
grab.animation = { path: "img/anim_grab.png", width: 50, height: 50, nb: 1 };
toile.animation = { path: "img/anim_toile.png", width: 70, height: 70, nb: 1 };
toilecd.animation = { path: "img/anim_toile.png", width: 50, height: 50, nb: 1 };
pasltime.animation = { path: "img/anim_time.png", width: 50, height: 50, nb: 1 };
vague.animation = { path: "img/anim_vague.png", width: 70, height: 70, nb: 10 };
ecrasement.animation =  { path: "img/anim_marteau.png", width: 100, height: 100, nb: 1 };

// liste des skins
let listeSkins = [
    {obtention : 0, nom : "Défaut" , lien : `img/skins/WitchHuntersLeader.png`, select : 1 }, // select par défaut
    {obtention : 10, nom : "Forgeron" , lien : `img/skins/LegendaryKnightsBlacksmithRemment.png`},
    {obtention : 20, nom : "Chevalier Maudit" , lien : `img/skins/BossMythicalKnightGoldnharl.png`},
    {obtention : 30, nom : "Magicien" , lien : `img/skins/MageGarrintan.png`},
    {obtention : 45, nom : "Ange Gardien" , lien : `img/skins/CelestialBeatrix.png`},
    {obtention : 63, nom : "Mecha Dracozord" , lien : `img/skins/RobotDracozord.png`}
]

// effets speciaux de la game
effetAttGlu = { nom: "Attaques gluantes", debutCombat: function () { player.attGluantes(); } };
effetAttGla = { nom: "Attaques glacées", debutCombat: function () { player.attGlacees(); } };
effetCharo = { nom: "Charognard", debutCombat: function () { player.charognard(); } };
effetAttPois = { nom: "Attaques empoisonnées", debutCombat: function () { player.attPois(); } };

listeGameEffets = [effetAttGlu, effetAttGla, effetCharo, effetAttPois];

carterie.effetCell = function (cell, lanceur) {
    // roll carte et tape ou heal
    let deck = ['s', 'd', 'h', 'c'];
    if (this.blackonly) {
        deck = ['s', 'c'];
    }

    let dommages = 1 + getRandomInt(10);
    let carte = deck[Math.floor(Math.random() * deck.length)];
    let img = 'img/maneki/' + (dommages).toString() + carte + '.svg';
    splash_projectile($("#" + lanceur.pos())[0], $("#" + cell.posNum)[0], { path: img, width: 50, height: 70, nb: 1 });
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
        splash_img(document.getElementById(22), { path: "img/maneki/arrow.png", width: 50, height: 50, timeout: 3000, nofade: 1 });
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
            setTimeout(() => splash_img(document.getElementById(cercle[i % 4]), { path: "img/maneki/arrow.png", width: 50, height: 50, timeout: 100 }), i * 100);
        }
        setTimeout(() => splash_img(document.getElementById(cercle[effet]), { path: "img/maneki/arrow.png", width: 50, height: 50, timeout: 500 }), 800 + effet * 100);
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

