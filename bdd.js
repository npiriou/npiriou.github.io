

// Sorts
pression = new sort("PRESSION", "Pression", 4, 7, 9, 1, 2, 0, "NORMALE", "CASE", 1, "img/pression.jpg");
cac = new sort("CAC", "Attaque au CaC", 3, 3, 4, 1, 1, 0, "NORMALE", "CASE", 1, "img/cac.png");
missile = new sort("MISSILE", "Missile", 4, 3, 4, 2, 10, 0, "NORMALE", "CASE", 1, "img/missile.png");

// Entites
player = new entite("player", 6, 3, 50, [cac, pression,missile], "ALLY", null, "img/player.png"); // player

mannequin = new entite("mannequin", 0, 0, 18, [], "ENEMY", iaMannequin, "img/mannequin.png");
ogre = new entite("ogre", 9, 2, 80, [cac], "ENEMY", iaDebile, "img/ogre.png");
orc = new entite("orc", 7, 3, 30, [cac, pression], "ENEMY", iaDebile, "img/orc.png");
artillerie = new entite("artillerie", 8, 2, 30, [missile], "ENEMY", iaDebileRange, "img/arti.png");
test = new entite("test", 0, 0, 10, [], "NEUTRAL", null, "img/test.png");