effetBoostDo = function(entite){
    entite.bonusDo = entite.bonusDo + this.valeurEffet;
    console.log(entite.nom+" gagne "+this.valeurEffet+ "dommages");
    return 1;
}

pasdEffet = function(){return 1;}

// sort(code, nom, coutPA, baseDmgMin, baseDmgMax, porteeMin, porteeMax, POModif, zoneLancer, AoE, LdV, 
//       effet, valeurEffet, dureeEffet, cooldown, logo)
pression = new sort("PRESSION", "Pression", 4, 7, 9, 1, 2, 0, "Aucune", "Case", 1, pasdEffet, 0, 0,0,"img/pression.jpg");
cac = new sort("CAC", "Attaque au CaC", 3, 3, 4, 1, 1, 0, "Aucune", "Case", 1, pasdEffet, 0,0,0,"img/cac.png");
missile = new sort("MISSILE", "Missile", 4, 3, 4, 2, 10, 1, "Aucune", "Case", 0, pasdEffet, 0,0,0,"img/missile.png");
rage = new sort("RAGE", "Rage", 4, 0, 0, 0, 0, 0, "Aucune", "Case", 1, effetBoostDo,  2, 2, 2,"img/rage.png");
fireball = new sort("FIREBALL", "Fireball", 6, 5, 9, 2, 5, 1, "Aucune", "Case", 1, pasdEffet, 0,0,0, "img/fireball.png");



// Entites  nom, PAmax, PMmax, PVmax, sorts, side, ia, bonusDo, pourcentDo, skin
player = new entite("player", 6, 3, 50, [cac, pression,fireball,rage,missile ], "ALLY", null, 0, 0, "img/player.png"); // player

mannequin = new entite("mannequin", 0, 0, 18, [], "ENEMY", iaMannequin,0, 0, "img/mannequin.png");
ogre = new entite("ogre", 9, 2, 80, [cac], "ENEMY", iaDebile,0, 0, "img/ogre.png");
orc = new entite("orc", 7, 3, 30, [cac, pression], "ENEMY", iaDebile,0, 0, "img/orc.png");
artillerie = new entite("artillerie", 8, 2, 30, [missile], "ENEMY", iaDebileRange, 0, 0,"img/arti.png");
test = new entite("test", 0, 0, 10, [], "NEUTRAL", null, 0, 0, "img/test.png");

