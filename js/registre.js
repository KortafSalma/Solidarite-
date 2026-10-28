/* Registre : recherche, filtres, tri et états (démo locale). */

"use strict";

const state = Store.load();
majHeaderSession();

const els = {
  recherche: document.querySelector("#recherche"),
  categorie: document.querySelector("#categorie"),
  quartier: document.querySelector("#quartier"),
  etat: document.querySelector("#etat"),
  tri: document.querySelector("#tri"),
  compte: document.querySelector("#compte-resultats"),
  liste: document.querySelector("#liste-annonces"),
  vide: document.querySelector("#etat-vide"),
  chargement: document.querySelector("#chargement"),
  panneauErreur: document.querySelector("#panneau-erreur"),
  reinit: document.querySelector("#reinitialiser"),
  voirTout: document.querySelector("#voir-tout"),
  reessayer: document.querySelector("#reessayer")
};

/* Pré-remplissage depuis les liens (index.html?categorie=..., ?q=...) */
const params = new URLSearchParams(location.search);
if (params.get("categorie")) {
  const c = params.get("categorie");
  [...els.categorie.options].forEach(o => { if (o.value === c) o.selected = true; });
}
if (params.get("q")) els.recherche.value = params.get("q");
if (params.get("quartier")) {
  const q = params.get("quartier");
  [...els.quartier.options].forEach(o => { if (o.value === q) o.selected = true; });
}

function annoncesFiltrees() {
  const q = els.recherche.value.trim().toLocaleLowerCase("fr");
  const cat = els.categorie.value;
  const ville = els.quartier.value;
  const etatChoisi = els.etat.value;
  const tri = els.tri.value;

  let res = Store.donationsPubliques().filter(d => {
    const searchable = [d.titre, d.description, d.categorie, d.quartier].join(" ").toLocaleLowerCase("fr");
    const matchQ = !q || searchable.includes(q);
    const matchCat = !cat || d.categorie === cat;
    const matchVille = !ville || d.quartier.startsWith(ville);
    const matchEtat = !etatChoisi || d.etat === etatChoisi;
    return matchQ && matchCat && matchVille && matchEtat;
  });

  if (tri === "titre") {
    res = res.slice().sort((a, b) => a.titre.localeCompare(b.titre, "fr"));
  } else if (tri === "ancien") {
    res = res.slice().sort((a, b) => a.no.localeCompare(b.no));
  } else {
    res = res.slice().sort((a, b) => b.no.localeCompare(a.no));
  }
  return res;
}

function afficher() {
  const res = annoncesFiltrees();

  els.liste.innerHTML = res.map(d => ligneRegistre(d, true)).join("");

  const pluriel = res.length > 1 ? "s" : "";
  els.compte.innerHTML = `<b>${res.length}</b> annonce${pluriel} affichée${pluriel} (registre de démonstration)`;

  els.vide.hidden = res.length > 0;
  els.liste.hidden = res.length === 0;
  els.liste.setAttribute("aria-busy", "false");

  if (state.erreur) {
    els.panneauErreur.hidden = false;
    els.liste.hidden = true;
    els.vide.hidden = true;
  }
}

function animerChargement(callback) {
  els.liste.hidden = true;
  els.vide.hidden = true;
  els.chargement.hidden = false;
  window.setTimeout(() => {
    els.chargement.hidden = true;
    callback();
  }, 450);
}

["change", "input"].forEach(evenement => {
  els.recherche.addEventListener("input", afficher);
  [els.categorie, els.quartier, els.etat, els.tri].forEach(sel =>
    sel.addEventListener(evenement, afficher)
  );
});

els.reinit.addEventListener("click", () => {
  els.recherche.value = "";
  els.categorie.value = "";
  els.quartier.value = "";
  els.etat.value = "";
  els.tri.value = "recent";
  history.replaceState(null, "", "dons.html");
  afficher();
});

els.voirTout.addEventListener("click", () => els.reinit.click());

if (els.reessayer) {
  els.reessayer.addEventListener("click", () => {
    els.panneauErreur.hidden = true;
    animerChargement(afficher);
  });
}

/* Premier affichage : l'état de chargement est montré brièvement, honnêtement. */
animerChargement(afficher);
