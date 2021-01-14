const addOnClicPrevisuSort = () => {
  for (let index = 0; index < player.sorts.length; index++) {
    document
      .getElementsByClassName("sort")
      [index].addEventListener("click", previsuSort);
  }
};

// arrow function does NOT work here because we use 'this'
const previsuSort = function (sortClique) {
  let sortUtilise;
  typeof sortClique === "number"
    ? (sortUtilise = sortClique)
    : (sortUtilise = this.dataset.sort);

  if (game.phase.includes("TURN_PLAYER")) {
    retirerToutesPrevisuSort();
    if (
      player.sorts[sortUtilise].coutPA <= player.PAact &&
      player.cdSorts[sortUtilise] == 0
    ) {
      game.phase = "TURN_PLAYER_SPELL";

      game.sortActif = player.sorts[sortUtilise];

      [...document.getElementsByClassName("cell")].forEach(
        (elemCell, index) => {
          if (
            game.sortActif.estAPortee(player.pos(), index, player.POBonus) &&
            (!game.sortActif.LdV || isInSight(player.pos(), index))
          ) {
            elemCell.classList.add("previsuSort");
            if (game.sortActif.AoE === "Croix") {
              elemCell.classList.add("previsuSortCroix");
            }
          }
        },
      );
    }
  }
};

const retirerToutesPrevisuSort = () => {
  [...document.getElementsByClassName("cell")].forEach((elemCell) => {
    elemCell.classList.remove("previsuSort");
    elemCell.classList.remove("previsuSortCroix");
  });
};
const retirerToutesPrevisuPMMob = () => {
  [...document.getElementsByClassName("cell")].forEach((elemCell) =>
    elemCell.classList.remove("previsuPMMob"),
  );
};

const addHoverCell = () => {
  [...document.getElementsByClassName("cell")].forEach((elemCell) => {
    elemCell.children[0].addEventListener("mouseover", onHoverCell);
    elemCell.children[0].addEventListener("mouseout", onMouseOutOfCell);
  });
};
const onHoverCell = function () {
  if (
    contientEntite(tabCells[this.id]) &&
    tabCells[this.id].contenu.nom != "Tonneau"
  ) {
    tabCells[this.id].contenu.afficherStatsEntite();
    tabCells[this.id].contenu.afficherPrevisuPMMob();
  } else if (estVide(tabCells[this.id])) {
    if (game.phase != "TURN_PLAYER_MOVE") {
      return;
    }
    let chemin = estAPorteeDeDeplacement(player.pos(), this.id, player.PMact);
    if (chemin) {
      chemin.forEach((cel) => {
        document
          .getElementsByClassName("cell")
          [posFromxy(cel[0], cel[1])].classList.add("previsuPMPlusieurs");
      });
    }
  }
};

const onMouseOutOfCell = () => {
  [...document.getElementsByClassName("cell")].forEach((elemCell) =>
    elemCell.classList.remove("previsuPMPlusieurs"),
  );
  retirerToutesPrevisuPMMob();
};

const onHoverSort = function () {
  if (player.sorts[this.dataset.sort]) {
    player.sorts[this.dataset.sort].afficherStatsSort();
  }
};

window.onkeydown = (event) => {
  if (event.keyCode == 27 && game.phase == "TURN_PLAYER_SPELL") {
    retirerToutesPrevisuSort();
    game.phase = "TURN_PLAYER_MOVE";
  }
  if (event.keyCode == 32 && game.phase.includes("TURN_PLAYER")) {
    passerTourJoueur();
  }
  if (
    (event.keyCode == 65 || event.keyCode == 49) &&
    game.phase.includes("TURN_PLAYER") &&
    player.sorts[0]
  ) {
    previsuSort(0);
  }
  if (
    (event.keyCode == 90 || event.keyCode == 50) &&
    game.phase.includes("TURN_PLAYER") &&
    player.sorts[1]
  ) {
    previsuSort(1);
  }
  if (
    (event.keyCode == 69 || event.keyCode == 51) &&
    game.phase.includes("TURN_PLAYER") &&
    player.sorts[2]
  ) {
    previsuSort(2);
  }
  if (
    (event.keyCode == 82 || event.keyCode == 52) &&
    game.phase.includes("TURN_PLAYER") &&
    player.sorts[3]
  ) {
    previsuSort(3);
  }
  if (
    (event.keyCode == 84 || event.keyCode == 53) &&
    game.phase.includes("TURN_PLAYER") &&
    player.sorts[4]
  ) {
    previsuSort(4);
  }
  if (
    (event.keyCode == 89 || event.keyCode == 54) &&
    game.phase.includes("TURN_PLAYER") &&
    player.sorts[5]
  ) {
    previsuSort(5);
  }
  if (
    (event.keyCode == 85 || event.keyCode == 55) &&
    game.phase.includes("TURN_PLAYER") &&
    player.sorts[6]
  ) {
    previsuSort(6);
  }
  if (
    (event.keyCode == 73 || event.keyCode == 56) &&
    game.phase.includes("TURN_PLAYER") &&
    player.sorts[7]
  ) {
    previsuSort(7);
  }
  if (
    (event.keyCode == 79 || event.keyCode == 57) &&
    game.phase.includes("TURN_PLAYER") &&
    player.sorts[8]
  ) {
    previsuSort(8);
  }
  if (
    (event.keyCode == 80 || event.keyCode == 58) &&
    game.phase.includes("TURN_PLAYER") &&
    player.sorts[9]
  ) {
    previsuSort(9);
  }
};

window.addEventListener("keydown", (e) => {
  // empeche le scrolling quand on tape espace
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  retirerToutesPrevisuSort();
  game.phase = "TURN_PLAYER_MOVE";
});
