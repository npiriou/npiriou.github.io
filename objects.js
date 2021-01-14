class cell {
  constructor(posNum, posX, posY, contenu) {
    this.posNum = posNum;
    this.posX = posX;
    this.posY = posY;
    this.contenu = contenu;
    this.glyphes = [];

    this.recevoirSort = async function (entite) {
      pivoterEntite(entite, this.posNum);
      refreshBoard();
      entite.mettreSortEnCd();
      if (!(await game.sortActif.effetCell(this, entite))) {
        // sort sans dommage
        ajouterAuChatType(entite.nom + " lance " + game.sortActif.nom, 0);
        await this.assignCollateral(entite);
        return;
      }
      if (game.sortActif.animation) {
        splash_projectile(
          $("#" + entite.pos())[0],
          $("#" + this.posNum)[0],
          game.sortActif.animation,
        );
      }

      if (this.contenu) {
        //si la case est occupee
        await this.contenu.recevoirSort(entite);
      } else {
        // si la case est vide
        ajouterAuChatType(entite.nom + " lance " + game.sortActif.nom, 0);
        splash(document.getElementById(this.posNum), "");
      }

      await this.assignCollateral(entite); // si cest un sort de zone
    };

    this.assignCollateral = async function (lanceur) {
      let arrPos = [];
      switch (game.sortActif.AoE) {
        case "Case":
          return;
        case "Croix":
          arrPos = posAdjacentes(this.posNum);
          break;
      }
      for (let i = 0; i < arrPos.length; i++) {
        await tabCells[arrPos[i]].recevoirSortCollateral(lanceur);
      }
    };

    this.recevoirSortCollateral = async function (entite) {
      await game.sortActif.effetCell(this, entite); // joue l'effet du sort s'il en a un

      if (this.contenu) {
        //si la case est occupee
        if (!(await game.sortActif.effet(this.contenu))) {
          // sort sans dommage
          return;
        }
        this.contenu.retirerPVs(calculDommages(game.sortActif, entite));
        if (entite) await triggerDommagesSubis(entite, this.contenu);
      }
    };

    this.ajouterGlyphe = function (
      lanceur,
      nombreTours,
      callback,
      image = null,
    ) {
      this.glyphes.push([lanceur, nombreTours, callback]);
      if (image) {
        document.getElementById(this.posNum).style.backgroundImage =
          "url('" + image + "')";
        document.getElementById(this.posNum).style.backgroundSize = "4vw 4vw";
      } else {
        document.getElementById(this.posNum).classList.add("glyph");
      }
    };
    this.retirerGlyphe = function (lanceur) {
      for (let i = this.glyphes.length - 1; i >= 0; i--) {
        if (this.glyphes[i][0] == lanceur) {
          document.getElementById(this.posNum).style.backgroundImage = "";
          document.getElementById(this.posNum).style.backgroundSize = "";
          document.getElementById(this.posNum).classList.remove("glyph");
          this.glyphes.splice(i, 1);
        }
      }
    };
    this.triggerGlyphe = function (entite) {
      this.glyphes.forEach((infos) => {
        // lanceur = infos[0];
        // // tours = infos[1];
        // callback = infos[2];
        // callback(this, lanceur, entite);
        // PAS TESTE
      });
    };
  }
}

class entite {
  constructor(
    nom,
    PAmax,
    PMmax,
    PVmax,
    POBonus,
    sorts,
    side,
    ia,
    bonusDo,
    pourcentDo,
    skin,
    poids,
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
    this.pourcentCrit = 5;
    this.invocation = 0;
    this.effets = []; // ex : [{nom : "poison5dmg", dureeRestante : "3"}, {nom : "puissance", dureeRestante : "2"}]
    this.resetEffets = function () {
      this.effets = [];
    };
    this.reduireDureeEffets = async function () {
      for (let i = this.effets.length - 1; i >= 0; i--) {
        if (this.effets[i].dureeRestante > 0) {
          this.effets[i].dureeRestante--;
          if (this.effets[i].debutTour) {
            await this.effets[i].debutTour();
          }
        }
        if (this.effets[i].dureeRestante == 0) {
          if (this.effets[i].fin) {
            this.effets[i].fin();
          }
          this.effets.splice(i, 1);
        }
        if (this.PVact > 0) {
          continue;
        } else {
          break;
        }
      }
    };

    this.cdSorts = [];
    this.resetcdSorts = function () {
      this.cdSorts = [];
      for (let i = 0; i < this.sorts.length; i++) {
        this.cdSorts.push(0);
      }
    };
    this.resetcdSorts();
    this.reduirecdSorts = function () {
      for (let i = 0; i < this.cdSorts.length; i++) {
        if (this.cdSorts[i] > 0) this.cdSorts[i]--;
      }
    };
    this.mettreSortEnCd = function () {
      for (let i = 0; i < this.sorts.length; i++) {
        if (game.sortActif.code == this.sorts[i].code) {
          this.cdSorts[i] = this.sorts[i].cooldown;
          break;
        }
      }
    };

    this.recevoirSort = async function (entite) {
      ajouterAuChatType(
        entite.nom +
          " lance le sort " +
          game.sortActif.nom +
          " sur " +
          this.nom,
        0,
      );
      if (!(await game.sortActif.effet(this))) {
        // sort sans dommage
        return;
      }
      this.retirerPVs(calculDommages(game.sortActif, entite));
      if (entite) await triggerDommagesSubis(entite, this);
    };
    this.aDejaSort = function (sort) {
      for (let i = 0; i < player.sorts.length; i++) {
        if (player.sorts[i] == sort) {
          return 1;
        }
      }
      return 0;
    };

    this.pos = function () {
      for (let index = 0; index < tabCells.length; index++) {
        if (contientEntite(tabCells[index])) {
          if (tabCells[index].contenu == this) {
            return index;
          }
        }
      }
    };
    this.resetPAPM = function () {
      this.PAact = this.PAmax;
      this.PMact = this.PMmax;
    };
    this.retirerPASort = function () {
      this.PAact = this.PAact - game.sortActif.coutPA;
      griserOuDegriserSorts();
    };
    this.retirerPVs = function (PVPerdus) {
      this.PVact = Math.max(this.PVact - PVPerdus, 0);
      let celltarget = document.getElementById(this.pos());
      splash(celltarget, " - " + PVPerdus);
      refreshBoard();
      this.afficherStatsEntite();

      ajouterAuChatType(
        this.nom +
          " perd " +
          PVPerdus +
          " PVs. Il lui reste " +
          this.PVact +
          " PVs.",
        0,
      );
      if (this.PVact <= 0) {
        this.PVact = 0;
        this.mort();
        refreshBoard();
      }
    };
    this.ajouterPVs = function (PVGagnesBase) {
      //     let crit = coupCritique(Lanceur);
      let PVGagnes = PVGagnesBase; //*crit;
      this.PVact = Math.min(this.PVact + PVGagnes, this.PVmax); // max PVmax
      let celltarget = document.getElementById(this.pos());

      splash_heal(celltarget, " + " + PVGagnes);
      refreshBoard();
      ajouterAuChatType(
        this.nom +
          " gagne " +
          PVGagnes +
          " PVs. Il lui reste " +
          this.PVact +
          " PVs.",
        0,
      );
    };

    this.ajouterDo = function (nom, DoAAjouter, duree) {
      let receveur = this;
      this.effets.push({
        nom: nom,
        valeur: DoAAjouter,
        dureeRestante: duree,
        fin: function () {
          receveur.bonusDo -= DoAAjouter;
        },
      });
      this.bonusDo += DoAAjouter;
      let celltarget = document.getElementById(this.pos());
      splash_rage(celltarget, " + " + DoAAjouter);
      ajouterAuChatType(
        this.nom +
          " gagne " +
          DoAAjouter +
          " dommages pour " +
          duree +
          " tours.",
        0,
      );
    };

    this.ajouterPCDo = function (nom, DoAAjouter, duree) {
      let receveur = this;
      this.effets.push({
        nom: nom,
        valeur: DoAAjouter,
        dureeRestante: duree,
        fin: function () {
          receveur.pourcentDo -= DoAAjouter;
        },
      });
      this.pourcentDo += DoAAjouter;
      let celltarget = document.getElementById(this.pos());
      splash_feuint(celltarget, " + " + DoAAjouter + " %");
      ajouterAuChatType(
        this.nom +
          " gagne " +
          DoAAjouter +
          "  % dommages pour " +
          duree +
          " tours.",
        0,
      );
    };

    this.ajouterPo = function (nom, PoAAjouter, duree) {
      let receveur = this;
      this.effets.push({
        nom: nom,
        valeur: PoAAjouter,
        dureeRestante: duree,
        fin: function () {
          receveur.POBonus -= PoAAjouter;
        },
      });
      this.POBonus += PoAAjouter;
      let celltarget = document.getElementById(this.pos());
      splash_PA(celltarget, "");
      ajouterAuChatType(
        this.nom +
          " gagne " +
          PoAAjouter +
          " de portée pour " +
          duree +
          " tours.",
        0,
      );
    };
    this.poison = function (nom, dommagesBase, duree, lanceur) {
      let receveur = this;
      this.effets.push({
        nom: nom,
        valeur: dommagesBase,
        dureeRestante: duree,
        debutTour: async function () {
          // on utilise pas calcul dommages pour ne pas trigger les crit par exemple
          receveur.retirerPVs(
            Math.round(
              dommagesBase * ((lanceur.pourcentDo + 100) / 100) +
                lanceur.bonusDo,
            ),
          );
          await sleep(200);
        },
      });

      let celltarget = document.getElementById(this.pos());
      splash_invo(celltarget);
      ajouterAuChatType(
        this.nom + " est empoisonné pour " + duree + " tours.",
        0,
      );
    };

    this.attGluantes = function () {
      this.effets.push({
        nom: "Attaques gluantes",
        dureeRestante: 999,
        dommagesSubis: async function (cible) {
          if (getRandomInt(5) != 0 || !cible || cible.PVact == 0) {
            return;
          }
          let add = -1;
          if (add < 0 && Math.abs(add) > cible.PMact) add = 0 - cible.PMact; // on ne peut pas retirer plus que ce qu'il a
          if (cible.PMact > 0 && add != 0) {
            cible.PMact += add;
            let celltarget = document.getElementById(cible.pos());
            splash_pm(celltarget, add + " PM");
            ajouterAuChatType(cible.nom + " perd " + Math.abs(add) + " PM.", 0);
          }
          await sleep(100);
        },
      });
    };
    this.attGlacees = function () {
      this.effets.push({
        nom: "Attaques glacées",
        dureeRestante: 999,
        dommagesSubis: async function (cible) {
          if (Math.random() > 1 / 3 || !cible || cible.PVact == 0) {
            return;
          }
          let add = -1;
          if (add < 0 && Math.abs(add) > cible.PAact) add = 0 - cible.PAact; // on ne peut pas retirer plus que ce qu'il a
          if (cible.PAact > 0 && add != 0) {
            cible.PAact += add;
            let celltarget = document.getElementById(cible.pos());
            splash_PA(celltarget, add + " PA");
            ajouterAuChatType(cible.nom + " perd " + Math.abs(add) + " PA.", 0);
          }
          await sleep(100);
        },
      });
    };
    this.attPois = function () {
      let lanceur = this;
      this.effets.push({
        nom: "Attaques empoisonnées",
        dureeRestante: 999,
        dommagesSubis: async function (cible) {
          if (Math.random() > 1 / 3 || !cible || cible.PVact == 0) {
            return;
          }
          ajouterAuChatType(cible.nom + " est empoisonné.", 0);
          cible.poison("Empoisonné", 1, 2, lanceur);
          await sleep(100);
        },
      });
    };

    this.charognard = function () {
      let lanceur = this;
      this.effets.push({
        nom: "Charognard",
        dureeRestante: 999,
        onKill: async function () {
          lanceur.ajouterPVs(2);
        },
      });
    };

    this.ajouterSplitOnDeath = function (nom, nbSpawn, duree) {
      let lanceur = this;
      // on cherche quelle taille faire spawn selon la taille au dessus
      let willSpawn = globuleSmall;
      switch (lanceur.nom) {
        case "Globule Royal":
          willSpawn = globuleBig;
          break;
        case "Grand Globule":
          willSpawn = globuleMedium;
          break;
        case "Globule":
          willSpawn = globuleSmall;
          break;
      }
      this.effets.push({
        nom: nom,
        valeur: nbSpawn,
        dureeRestante: duree,
        onDeath: () => {
          // faire spawn nbSpawn petit glob
          let posAdj = posAdjacentes(lanceur.pos());
          posAdj.forEach((pos) => {
            // un blob spawn dans chaque case vide adjacente
            // 1 chance sur 3 de ne pas spawn
            if (estVide(tabCells[pos]) && Math.random() < 2 / 3) {
              tabCells[pos].contenu = willSpawn.clone();
            }
          });
        },
      });
    };

    this.pousser = async function (distPou, poslanceur) {
      await sleep(200);

      let xl = xFromPos(poslanceur);
      let yl = yFromPos(poslanceur);
      let xr = xFromPos(this.pos());
      let yr = yFromPos(this.pos());
      let xd = 0;
      let yd = 0;

      xl == xr ? (xd = 0) : xl > xr ? (xd = -1) : (xd = 1);
      yl == yr ? (yd = 0) : yl > yr ? (yd = -1) : (yd = 1);

      for (let i = 0; i < distPou; i++) {
        if (xr + xd < 0 || xr + xd > 9 || yr + yd < 0 || yr + yd > 9) {
          break;
        } // check si la pos suivante existe

        if (
          tabCells[posFromxy(xr + xd, yr + yd)] &&
          estVide(tabCells[posFromxy(xr + xd, yr + yd)])
        ) {
          await deplacerContenu(posFromxy(xr, yr), posFromxy(xr + xd, yr + yd));
          xr = xr + xd;
          yr = yr + yd;
        }
      }
    };
    this.grab = async function (distGrab, poslanceur) {
      await sleep(400);
      let xl = xFromPos(poslanceur);
      let yl = yFromPos(poslanceur);
      let xr = xFromPos(this.pos());
      let yr = yFromPos(this.pos());
      let xd = 0;
      let yd = 0;

      xl == xr ? (xd = 0) : xl > xr ? (xd = 1) : (xd = -1);
      yl == yr ? (yd = 0) : yl > yr ? (yd = 1) : (yd = -1);
      for (let i = 0; i < distGrab; i++) {
        if (estVide(tabCells[posFromxy(xr + xd, yr + yd)])) {
          await deplacerContenu(posFromxy(xr, yr), posFromxy(xr + xd, yr + yd));
          xr = xr + xd;
          yr = yr + yd;
        }
      }
    };

    this.mort = function () {
      triggeronDeath(this);
      ajouterAuChatType(this.nom + " est mort.", 0);
      tabCells[this.pos()].contenu = null;
      tabCells.forEach((cell) => {
        cell.retirerGlyphe(this);
      });
      if (this.side == "ENEMY") {
        triggeronKill();
      }
      refreshBoard();
      checkEndRound();
      delete this;
    };
    this.clone = function () {
      return new entite(
        this.nom,
        this.PAmax,
        this.PMmax,
        this.PVmax,
        this.POBonus,
        this.sorts,
        this.side,
        this.ia,
        this.bonusDo,
        this.pourcentDo,
        this.skin,
      );
    };

    this.afficherPrevisuPMMob = function () {
      let posAEclairer;
      if (
        game.phase != "TURN_PLAYER_MOVE" ||
        !contientEntite(tabCells[this.pos()])
      ) {
        return;
      } else {
        let chemin;
        for (let i = 0; i < tabCells.length; i++) {
          chemin = trouverChemin(this.pos(), i);
          if (chemin && chemin.length <= this.PMact) {
            for (let j = 0; j < chemin.length; j++) {
              posAEclairer = posFromxy(chemin[j][0], chemin[j][1]);
              if (estVide(tabCells[posAEclairer])) {
                document
                  .getElementsByClassName("cell")
                  [posAEclairer].classList.add("previsuPMMob");
              }
            }
          }
        }
      }
    };

    this.afficherStatsEntite = function () {
      let affEffets = [];
      this.effets.forEach((e) => {
        affEffets.push(e.nom);
      });
      document.getElementById("carboiteats").innerHTML = template.format(
        this.PVact,
        this.PVmax,
        this.PAact,
        this.PAmax,
        this.PMact,
        this.PMmax,
        this.bonusDo,
        this.pourcentDo,
        this.POBonus,
        this.pourcentCrit,
        affEffets.join(", "),
      );
      document.getElementsByClassName("card__image-container")[0].innerHTML =
        `<img class='artSpell' src="` + this.skin + `"></img>`;
      document.getElementsByClassName(
        "card__name card_title",
      )[0].innerHTML = this.nom;
      document.getElementsByClassName("card__ability")[0].innerHTML = "";
    };
  }
}

class sort {
  constructor(
    code,
    nom,
    coutPA,
    baseDmgMin,
    baseDmgMax,
    porteeMin,
    porteeMax,
    POModif,
    zoneLancer,
    AoE,
    LdV,
    effet,
    valeurEffet,
    dureeEffet,
    cooldown,
    logo,
    description,
  ) {
    this.code = code;
    this.nom = nom;
    this.coutPA = coutPA;
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
    this.effetCell = function () {
      return 1;
    };
    this.estAPortee = function (pos1, pos2, bonusPO = 0) {
      if (this.zoneLancer == "Ligne" && !sontEnLigne(pos1, pos2)) {
        return 0;
      }
      if (!this.POModif) {
        bonusPO = 0;
      }
      let diffX = xFromPos(pos1) - xFromPos(pos2);
      let diffY = yFromPos(pos1) - yFromPos(pos2);
      let diffTotale = Math.abs(diffX) + Math.abs(diffY);
      if (
        diffTotale <= Math.max(this.porteeMax + bonusPO, this.porteeMin) &&
        diffTotale >= this.porteeMin
      )
        return 1;
      else return 0;
    };
    this.afficherStatsSort = function () {
      let dmg, dmg2, pom, ldv, cd, duree, c;
      dmg2 = "";
      if (this.baseDmgMax) {
        dmg = this.baseDmgMin + " à " + this.baseDmgMax;
      } else dmg = "-";

      if (this.POModif) pom = "Oui";
      else pom = "Non";
      if (this.LdV) ldv = "Oui";
      else ldv = "Non";
      if (this.cooldown > 999) cd = "Une fois par combat";
      else cd = this.cooldown;
      if (this.dureeEffet) duree = this.dureeEffet + " tours";
      else duree = "-";
      if (this.zoneLancer) c = zoneLancer;
      else c = "Non";

      document.getElementById("carboiteats").innerHTML = templateSort.format(
        this.coutPA,
        dmg,
        dmg2,
        this.porteeMin,
        this.porteeMax,
        pom,
        c,
        this.AoE,
        ldv,
        cd,
        duree,
      );
      document.getElementsByClassName("card__image-container")[0].innerHTML =
        `<img class='artSpell' src ="` + this.logo + `"></img>`;
      document.getElementsByClassName(
        "card__name card_title",
      )[0].innerHTML = this.nom;
      document.getElementsByClassName(
        "card__ability",
      )[0].innerHTML = this.description;
    };
  }
}
