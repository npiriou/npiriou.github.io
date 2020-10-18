function cell(posNum, posX, posY, contenu) {
    this.posNum = posNum;
    this.posX = posX;
    this.posY = posY;
    this.contenu = contenu;

}

function entite(
    nom, PAmax, PMmax, PVmax, sorts, side, ia, bonusDo, pourcentDo, skin
) {
    this.nom = nom;
    this.PAmax = PAmax;
    this.PAact = PAmax;
    this.PMmax = PMmax;
    this.PMact = PMmax;
    this.PVact = PVmax;
    this.PVmax = PVmax;
    this.sorts = sorts;
    this.side = side; // "ALLY" ou "ENEMY"
    this.ia = ia;
    this.bonusDo = bonusDo;
    this.pourcentDo = pourcentDo;
    this.skin = skin;
    this.cdSorts = [];
    this.resetcdSorts = function () {
    let    a = []
        for (let i = 0; i < this.sorts.length; i++) {
            a.push(0);
        }
        return a;
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

    this.recevoirSort = function (bonusDo, pcDo) {
        game.sortActif.effet(this);
        if (!bonusDo) bonusDo = 0;
        if (!pcDo) pcDo = 0;
        let dommagesBase = Math.floor(Math.random() * (game.sortActif.baseDmgMax - game.sortActif.baseDmgMin + 1)) + game.sortActif.baseDmgMin;
       let dommages = dommagesBase * (pcDo + 1) + bonusDo;
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
        this.PVact = this.PVact - PVPerdus;
        let celltarget = document.getElementById(this.pos());

        splash(celltarget, " - " + PVPerdus);
        refreshBoard();
        console.log(this.nom + " perd " + PVPerdus + " PVs. Il lui reste " + this.PVact + " PVs.");

        if (this.PVact <= 0) {
            this.PVact = 0;
            this.mort();
            refreshBoard();
        }
    }
    this.mort = function () {
        console.log(this.nom + " est mort.");
        tabCells[this.pos()].contenu = null;
        refreshBoard();
        checkEndRound();
    }
    this.clone = function () {
        return new entite(this.nom, this.PAmax, this.PMmax, this.PVmax, this.sorts, this.side, this.ia, this.bonusDo, this.pourcentDo, this.skin);
    }
    this.afficherStatsEntite = function () {
       
        document.getElementById("carteStats").innerHTML = template.format(this.PVact, this.PVmax, this.PAact, this.PAmax, this.PMact, this.PMmax, this.bonusDo, this.pourcentDo);
        document.getElementsByClassName("card__image-container")[0].innerHTML = `<img src ="` + this.skin + `"></img>`;
        document.getElementsByClassName("card__name card_title")[0].innerHTML = this.nom;
    }

}


function sort(code, nom, coutPA, baseDmgMin, baseDmgMax, porteeMin, porteeMax,
    POModif, zoneLancer, AoE, LdV, effet, valeurEffet, dureeEffet, cooldown, logo) {
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
    this.estAPortee = function (pos1, pos2) {
        let diffX = xFromPos(pos1) - xFromPos(pos2);
       let  diffY = yFromPos(pos1) - yFromPos(pos2)
      let   diffTotale = Math.abs(diffX) + Math.abs(diffY);
        if ((diffTotale <= this.porteeMax) && (diffTotale >= this.porteeMin)) return 1;
        else return 0;
    }
    this.afficherStatsSort = function () {

        if (this.POModif) pom = "Oui"; else pom = "Non";
        if (this.LdV) ldv = "Oui"; else ldv = "Non";

        document.getElementById("carteStats").innerHTML = templateSort.format(this.coutPA, this.baseDmgMin, this.baseDmgMax, this.porteeMin, this.porteeMax, pom, this.zoneLancer, this.AoE, ldv, this.cooldown);
        document.getElementsByClassName("card__image-container")[0].innerHTML = `<img src ="` + this.logo + `"></img>`;
        document.getElementsByClassName("card__name card_title")[0].innerHTML = this.nom;
    }
}

