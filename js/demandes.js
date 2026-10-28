/* Mes demandes : suivi des statuts (démo locale). */

"use strict";

const state = Store.load();
majHeaderSession();

const filtre = document.querySelector("#filtre-statut");
const listeMine = document.querySelector("#liste-mes-demandes");
const vide = document.querySelector("#vide-demandes");
const compte = document.querySelector("#compte-demandes");
const listeExemples = document.querySelector("#liste-exemples");

function afficher() {
  const lesMiennes = Store.allRequests().filter(r => r.origin === "vous");
  const statut = filtre.value;

  const visibles = statut ? lesMiennes.filter(r => r.statut === statut) : lesMiennes;

  listeMine.innerHTML = visibles.map(r => carteDemande(r)).join("");
  vide.hidden = lesMiennes.length > 0;
  compte.textContent = lesMiennes.length > 0
    ? `${visibles.length} demande${visibles.length > 1 ? "s" : ""} affichée${visibles.length > 1 ? "s" : ""} sur ${lesMiennes.length} (démonstration)`
    : "aucune demande enregistrée dans ce navigateur";

  const exemples = Store.allRequests().filter(r => r.origin === "exemple");
  listeExemples.innerHTML = exemples.map(r => carteDemande(r, true)).join("");}

filtre.addEventListener("change", afficher);
afficher();

if (state.erreur) {
  const note = document.createElement("p");
  note.className = "notice notice-erreur";
  note.textContent = state.erreur;
  document.querySelector("#contenu").prepend(note);
}
