/* Accueil : compte les catégories du registre de démonstration
   et affiche trois annonces choisies. */

"use strict";

const state = Store.load();
majHeaderSession();

/* Compte des catégories (données de démonstration) */
document.querySelectorAll("[data-nb]").forEach(el => {
  const cible = el.getAttribute("data-nb");
  const nb = Store.donationsPubliques().filter(d =>
    d.categorie === cible && ["Disponible", "Réservé"].includes(d.statut)
  ).length;
  el.textContent = nb > 0 ? `enregistrements ouverts : ${nb}` : "aucun enregistrement ouvert";
});

/* Trois annonces choisies (les plus récentes disponibles) */
const cible3 = document.querySelector("#annonces-accueil");
const choisies = Store.donationsPubliques()
  .filter(d => d.statut === "Disponible")
  .sort((a, b) => b.no.localeCompare(a.no))
  .slice(0, 3);

cible3.innerHTML = choisies.map(d => ligneRegistre(d, false)).join("");

/* Si le stockage est indisponible, le signaler clairement */
if (state.erreur) {
  const note = document.createElement("p");
  note.className = "notice notice-erreur";
  note.textContent = state.erreur;
  document.querySelector(".env-note .container").appendChild(note);
}
