effetBoostDo = function(entite){
    entite.bonusDo = entite.bonusDo + this.valeurEffet;
    console.log(entite.nom+" gagne "+this.valeurEffet+ " dommages");
    return 0;
}
effetSoin = function(entite){
    entite.ajouterPVs(this.valeurEffet);
    console.log(entite.nom+" gagne "+this.valeurEffet+ " PV");
    return 0;
}


pasdEffet = function(){return 1;}

// sort(code, nom, coutPA, baseDmgMin, baseDmgMax, porteeMin, porteeMax, POModif, zoneLancer, AoE, LdV, 
//       effet, valeurEffet, dureeEffet, cooldown, logo, description)
pression = new sort("PRESSION", "Pression", 4, 7, 9, 1, 2, 0, "Aucune", "Case", 1, pasdEffet, 0, 0,0,"img/pression.jpg", "Envoie un bon coup d'épée");
cac = new sort("CAC", "Attaque au CaC", 3, 3, 4, 1, 1, 0, "Aucune", "Case", 1, pasdEffet, 0,0,0,"img/cac.png", "Met une bonne patate à la cible");
missile = new sort("MISSILE", "Missile", 4, 3, 4, 4, 10, 1, "Aucune", "Case", 0, pasdEffet, 0,0,0,"img/missile.png", "Tire un missile sans ligne de vue");
rage = new sort("RAGE", "Rage", 4, 0, 0, 0, 0, 0, "Aucune", "Case", 1, effetBoostDo,  2, 2, 3,"img/rage.png", "Augmente ses dommages de 2");
fireball = new sort("FIREBALL", "Boule de feu", 6, 5, 9, 2, 5, 1, "Aucune", "Case", 1, pasdEffet, 0,0,0, "img/fireball.png", "Une boule de feu tout ce qu'il y a de plus classique");
doom = new sort("DOOM", "Doom", 0, 1000, 1000, 0, 100, 1, "Aucune", "Case", 0, pasdEffet, 0,0,0,"img/doom.jpg", "BOOOOOM");
gifle = new sort("GIFLE", "Gifle", 2, 2, 2, 1, 1, 0, "Aucune", "Case", 1, pasdEffet, 0,0,0,"img/gifle.png", "Met une petite claque humiliante à la cible");
pansements = new sort("PANSEMENTS", "Pansements", 4, 0, 0, 0, 0, 1, "Aucune", "Case", 1, effetSoin,  5, 0, 3,"img/pansement.png", "Un petit pansement et ça va mieux, soigne de 5 PV");


var listeSorts = [pression, cac, missile, rage, fireball, gifle, pansements];

// Entites  nom, PAmax, PMmax, PVmax, POBonus, sorts, side, ia, bonusDo, pourcentDo, skin, poids
player = new entite("Player", 6, 3, 50, 0, [cac], "ALLY", null, 0, 0, "img/player.png", 0); // player

mannequin = new entite("Mannequin", 3, 1, 10, 0, [cac], "ENEMY", iaDebile,0, 0, "img/mannequin.png", 2);
ogre = new entite("Ogre", 9, 2, 50, 0, [cac], "ENEMY", iaDebile,0, 0, "img/ogre.png", 3);
orc = new entite("Orc", 7, 3, 30, 0, [cac, pression], "ENEMY", iaDebile,0, 0, "img/orc.png", 5);
artillerie = new entite("Artillerie", 8, 1, 30, 0, [missile], "ENEMY", iaRangeMoinsDebile, 0, 0,"img/arti.png", 1);
sorcier = new entite("Sorcier", 8, 3, 25, 0, [fireball], "ENEMY", iaRangeMoinsDebile, 0, 0,"img/wizard.png", 7);
gobelin= new entite("Gobelin", 4, 5, 12, 0, [gifle], "ENEMY", iaDebile,0, 0, "img/gobelin.png", 2);
boite = new entite("boite", 0, 0, 10, 0, [], "NEUTRAL", null, 0, 0, "img/boite.png", 0);


var listeMobs = [mannequin, ogre, orc, artillerie, sorcier, gobelin];
