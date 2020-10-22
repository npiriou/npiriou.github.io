function cell(posNum, posX, posY, contenu) {
    this.posNum = posNum;
    this.posX = posX;
    this.posY = posY;
    this.contenu = contenu;
    this.glyphes = [];

    this.recevoirSort = function (entite) {
        ajouterAuChatType(entite.nom +" lance "+game.sortActif.nom, 0);
        entite.mettreSortEnCd();
        if (!game.sortActif.effetCell(this, entite)) {
            // sort sans dommage
            return;
        }
        if (game.sortActif.animation){splash_projectile($("#"+entite.pos())[0], $("#"+this.posNum)[0], game.sortActif.animation)}
        if (this.contenu) {
            this.contenu.recevoirSort(entite);
        } else {
            ajouterAuChatType("Voilà des PA bien gachés à lancer un sort dans le vide", 1);
            splash(document.getElementById(this.posNum), "");
        }
    }

    this.ajouterGlyphe = function (lanceur, nombreTours, callback, image = null) {
        this.glyphes.push([lanceur, nombreTours, callback]);
        if (image) {
            document.getElementById(this.posNum).style.backgroundImage = "url('" + image + "')";
            document.getElementById(this.posNum).style.backgroundSize="78px 78px";
        } else {
            document.getElementById(this.posNum).classList.add("glyph");
        }
    }

    this.triggerGlyphe = function (entite) {
        this.glyphes.forEach(infos => {
            // lanceur = infos[0];
            // // tours = infos[1];
            // callback = infos[2];
            // callback(this, lanceur, entite);
            // PAS TESTE
        });
    }
}

function entite(
    nom, PAmax, PMmax, PVmax, POBonus, sorts, side, ia, bonusDo, pourcentDo, skin, poids
) {
    this.nom = nom;
    this.PAmax = PAmax;
    this.PAact = PAmax;
    this.PMmax = PMmax;
    this.PMact = PMmax;
    this.PVact = PVmax;
    this.PVmax = PVmax;
    this.POBonus = POBonus;
    this.sorts = sorts;
    this.side = side; // "ALLY" ou "ENEMY"
    this.ia = ia;
    this.bonusDo = bonusDo;
    this.pourcentDo = pourcentDo;
    this.skin = skin;
    this.poids = poids;
    this.invocation = 0;
    this.effets = [];
    this.resetEffets = function () {
        this.effets = [];
    }

    this.cdSorts = [];
    this.resetcdSorts = function () {
        this.cdSorts = [];
        for (let i = 0; i < this.sorts.length; i++) {
            this.cdSorts.push(0);
        }
    }
    this.reduirecdSorts = function () {
        for (let i = 0; i < this.cdSorts.length; i++) {
            if (this.cdSorts[i] > 0) this.cdSorts[i]--;
        }
    }
    this.mettreSortEnCd = function () {
        for (let i = 0; i < this.sorts.length; i++) {
            if (game.sortActif.code == this.sorts[i].code) { this.cdSorts[i] = this.sorts[i].cooldown; break; }
        }
    }

    this.recevoirSort = function (entite) {
        ajouterAuChatType(entite.nom + " lance le sort " + game.sortActif.nom + " sur " + this.nom, 0);
        if (!game.sortActif.effet(this)) {
            // sort sans dommage
            return;
        }
        let dommagesBase = Math.floor(Math.random() * (game.sortActif.baseDmgMax - game.sortActif.baseDmgMin + 1)) + game.sortActif.baseDmgMin;
        let dommages = Math.round(dommagesBase * ((entite.pourcentDo + 100) / 100) + entite.bonusDo);
        this.retirerPVs(dommages);
    }
    this.pos = function () {
        for (let index = 0; index < tabCells.length; index++) {
            if (contientEntite(tabCells[index])) {
                if (tabCells[index].contenu == this) { return index; }
            }
        }
    }
    this.resetPAPM = function () {
        this.PAact = this.PAmax;
        this.PMact = this.PMmax;
    }
    this.retirerPASort = function () {
        this.PAact = this.PAact - game.sortActif.coutPA;
        griserOuDegriserSorts();
    }
    this.retirerPVs = function (PVPerdus) {
        this.PVact = Math.max(this.PVact - PVPerdus, 0);
        let celltarget = document.getElementById(this.pos());

        splash(celltarget, " - " + PVPerdus);
        refreshBoard();
        this.afficherStatsEntite();
        ajouterAuChatType(this.nom + " perd " + PVPerdus + " PVs. Il lui reste " + this.PVact + " PVs.", 0);
        if (this.PVact <= 0) {
            this.PVact = 0;
            this.mort();
            refreshBoard();
        }
    }
    this.ajouterPVs = function (PVGagnes) {
        this.PVact = Math.min(this.PVact + PVGagnes, this.PVmax); // max PVmax
        let celltarget = document.getElementById(this.pos());

        splash_heal(celltarget, " + " + PVGagnes);
        refreshBoard();
        ajouterAuChatType(this.nom + " gagne " + PVGagnes + " PVs. Il lui reste " + this.PVact + " PVs.",0);
    }

this.ajouterDo = function(DoAAjouter){
    this.bonusDo += DoAAjouter;
    let celltarget = document.getElementById(this.pos());
    splash_rage( celltarget," + " + DoAAjouter);
    ajouterAuChatType(this.nom + " gagne " + DoAAjouter + " dommages", 0);

}

    this.mort = function () {
        ajouterAuChatType(this.nom + " est mort.", 0);
        tabCells[this.pos()].contenu = null;
        refreshBoard();
        checkEndRound();
        delete this;
    }
    this.clone = function () {
        return new entite(this.nom, this.PAmax, this.PMmax, this.PVmax, this.POBonus, this.sorts, this.side, this.ia, this.bonusDo, this.pourcentDo, this.skin);
    }
    this.afficherStatsEntite = function () {

        document.getElementById("carboiteats").innerHTML = template.format(this.PVact, this.PVmax, this.PAact, this.PAmax, this.PMact, this.PMmax, this.bonusDo, this.pourcentDo, this.POBonus);
        document.getElementsByClassName("card__image-container")[0].innerHTML = `<img src ="` + this.skin + `"></img>`;
        document.getElementsByClassName("card__name card_title")[0].innerHTML = this.nom;
        document.getElementsByClassName("card__ability")[0].innerHTML = "";
    }

}


function sort(code, nom, coutPA, baseDmgMin, baseDmgMax, porteeMin, porteeMax,
    POModif, zoneLancer, AoE, LdV, effet, valeurEffet, dureeEffet, cooldown, logo, description) {
    this.code = code;
    this.nom = nom;
    this.coutPA = coutPA
    this.baseDmgMin = baseDmgMin;
    this.baseDmgMax = baseDmgMax;
    this.porteeMin = porteeMin;
    this.porteeMax = porteeMax;
    this.POModif = POModif;
    this.zoneLancer = zoneLancer;
    this.AoE = AoE;
    this.LdV = LdV;
    this.effet = effet;
    this.valeurEffet = valeurEffet;
    this.dureeEffet = dureeEffet;
    this.cooldown = cooldown;
    this.logo = logo;
    this.description = description;
    this.effetCell = function () { return 1; };
    this.estAPortee = function (pos1, pos2, bonusPO = 0) {
        if (!this.POModif) { bonusPO = 0; }
        let diffX = xFromPos(pos1) - xFromPos(pos2);
        let diffY = yFromPos(pos1) - yFromPos(pos2)
        let diffTotale = Math.abs(diffX) + Math.abs(diffY);
        if ((diffTotale <= this.porteeMax + bonusPO) && (diffTotale >= this.porteeMin)) return 1;
        else return 0;
    }
    this.afficherStatsSort = function () {

        if (this.POModif) pom = "Oui"; else pom = "Non";
        if (this.LdV) ldv = "Oui"; else ldv = "Non";
        if (this.cooldown > 999) cd = "Une fois par combat"; else cd = this.cooldown;

        document.getElementById("carboiteats").innerHTML = templateSort.format(this.coutPA, this.baseDmgMin, this.baseDmgMax, this.porteeMin, this.porteeMax, pom, this.zoneLancer, this.AoE, ldv, cd);
        document.getElementsByClassName("card__image-container")[0].innerHTML = `<img src ="` + this.logo + `"></img>`;
        document.getElementsByClassName("card__name card_title")[0].innerHTML = this.nom;
        document.getElementsByClassName("card__ability")[0].innerHTML = this.description;
    }
}

