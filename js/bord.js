/* Espace personnel : annonces et demandes de ce navigateur (démo). */

"use strict";

const state = Store.load();
majHeaderSession();
initOnglets(document.querySelector("main"));

/* Session : l'encart disparaît si une session de démo existe */
const encart = document.querySelector("#acces");
if (Store.getSession()) encart.hidden = true;

function ligneMesDons(d) {
  const peutReserver = d.statut === "Disponible";
  const peutRemettre = d.statut === "Réservé";
  const href = `don.html?id=${encodeURIComponent(d.id)}`;
  return `
    <article class="carte-ligne">
      <div>
        <h3><a href="${href}">${escapeHTML(d.titre)}</a></h3>
        <p class="meta">N° ${escapeHTML(d.no)}, ${escapeHTML(d.categorie)}, quartier ${escapeHTML(d.quartier)}, publiée le ${fmtDate(d.date)}${d.origin === "vous" ? "" : ", exemple fictif livré avec la démo"}</p>
      </div>
      <div>${chipStatutDon(d.statut)}</div>
      <div class="actions">
        ${peutReserver ? `<button type="button" class="btn-quiet" data-action="reserve" data-id="${escapeHTML(d.id)}">Marquer réservé</button>` : ""}
        ${peutRemettre ? `<button type="button" class="btn-quiet" data-action="remis" data-id="${escapeHTML(d.id)}">Marquer remis</button>` : ""}
        ${d.statut === "En attente" ? `<a class="btn-quiet" href="association.html">Voir la validation</a>` : ""}
      </div>
    </article>`;
}

function afficherDons() {
  const mesDons = Store.allDonations().filter(d => d.origin === "vous").sort((a, b) => b.no.localeCompare(a.no));
  const liste = document.querySelector("#liste-mes-dons");
  liste.innerHTML = mesDons.map(ligneMesDons).join("");
  document.querySelector("#vide-dons").hidden = mesDons.length > 0;

  liste.querySelectorAll("button[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      Store.setDonationStatut(btn.dataset.id, btn.dataset.action === "reserve" ? "Réservé" : "Remis");
      afficherDons();
    });
  });
}

function afficherDemandes() {
  const mesDemandes = Store.allRequests().filter(r => r.origin === "vous");
  const liste = document.querySelector("#liste-mes-demandes");
  liste.innerHTML = mesDemandes.map(r => carteDemande(r)).join("");
  document.querySelector("#vide-demandes").hidden = mesDemandes.length > 0;
}

afficherDons();
afficherDemandes();

if (state.erreur) {
  const note = document.createElement("p");
  note.className = "notice notice-erreur";
  note.textContent = state.erreur;
  document.querySelector("#contenu").prepend(note);
}
