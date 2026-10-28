/* Espace association : modération de démonstration.
   L'accès exige une session de démonstration au rôle "association".
   Aucune identité réelle n'est vérifiée : c'est un prototype. */

"use strict";

const state = Store.load();
majHeaderSession();

const session = Store.getSession();
const encartAcces = document.querySelector("#acces-moderateur");
const vue = document.querySelector("#vue-moderateur");

if (!session || session.role !== "association") {
  /* Porte d'accès : la vue reste cachée. */
  vue.hidden = true;
  if (session) {
    const intro = encartAcces.querySelector("p");
    intro.innerHTML = `<b>Accès réservé au rôle association (démonstration).</b> Votre session actuelle est « ${escapeHTML(session.nom)} » (rôle : ${escapeHTML(session.role)}). Se déconnecter puis se reconnecter en association suffit, dans la démo.`;
    encartAcces.querySelector("#lien-connexion").textContent = "Changer de rôle (démo)";
  }
} else {
  encartAcces.hidden = true;
  vue.hidden = false;

  initOnglets(document.querySelector("main"));

  const listeFile = document.querySelector("#liste-file");
  const videFile = document.querySelector("#vide-file");
  const listeSignales = document.querySelector("#liste-signales");
  const videSignales = document.querySelector("#vide-signales");
  const listeDemandes = document.querySelector("#liste-demandes");
  const videDemandes = document.querySelector("#vide-demandes");

  function bouton(action, id, libelle) {
    return `<button type="button" class="btn-quiet" data-action="${action}" data-id="${escapeHTML(id)}">${libelle}</button>`;
  }

  function ligneFile(d) {
    return `
      <article class="carte-ligne">
        <div>
          <h3><a href="don.html?id=${encodeURIComponent(d.id)}">${escapeHTML(d.titre)}</a></h3>
          <p class="meta">N° ${escapeHTML(d.no)}, ${escapeHTML(d.categorie)}, état « ${escapeHTML(d.etat)} », quartier ${escapeHTML(d.quartier)} — ${escapeHTML(d.description)}</p>
        </div>
        <div>${chipStatutDon(d.statut)}</div>
        <div class="actions">
          ${bouton("valider", d.id, "Valider l'annonce")}
          ${bouton("refuser", d.id, "Refuser")}
        </div>
      </article>`;
  }

  function ligneSignalee(d) {
    return `
      <article class="carte-ligne">
        <div>
          <h3><a href="don.html?id=${encodeURIComponent(d.id)}">${escapeHTML(d.titre)}</a></h3>
          <p class="meta">N° ${escapeHTML(d.no)}, ${escapeHTML(d.categorie)} — ${escapeHTML(d.motif || "Aucun motif enregistré (démo).")}</p>
        </div>
        <div>${chipStatutDon(d.statut)}</div>
        <div class="actions">
          ${bouton("lever", d.id, "Lever le signalement")}
          ${bouton("refuser", d.id, "Retirer l'annonce")}
        </div>
      </article>`;
  }

  function ligneDemande(r) {
    const don = Store.getDonationSafe(r.donationId);
    const href = Store.getDonation(r.donationId) ? `don.html?id=${encodeURIComponent(r.donationId)}` : "dons.html";
    const actions = r.statut === "Attente"
      ? bouton("accepter", r.id, "Accepter") + bouton("refuser-demande", r.id, "Refuser")
      : r.statut === "Acceptée"
        ? bouton("finaliser", r.id, "Marquer remis")
        : "";
    return `
      <article class="carte-ligne">
        <div>
          <h3><a href="${href}">${escapeHTML(don.titre)}</a></h3>
          <p class="meta">Demande du ${fmtDate(r.date)} par <b>${escapeHTML(r.donneurNom)}</b>${r.note ? `, « ${escapeHTML(r.note)} »` : ""}${r.origin === "exemple" ? ", demande fictive livrée avec la démo" : ""}</p>
        </div>
        <div>${chipStatutReq(r.statut)}</div>
        <div class="actions">${actions}</div>
      </article>`;
  }

  function afficher() {
    const file = Store.allDonations().filter(d => d.statut === "En attente");
    listeFile.innerHTML = file.map(ligneFile).join("");
    videFile.hidden = file.length > 0;

    const signalees = Store.allDonations().filter(d => d.statut === "Signalé");
    listeSignales.innerHTML = signalees.map(ligneSignalee).join("");
    videSignales.hidden = signalees.length > 0;

    const demandes = Store.allRequests().filter(r => ["Attente", "Acceptée"].includes(r.statut));
    listeDemandes.innerHTML = demandes.map(ligneDemande).join("");
    videDemandes.hidden = demandes.length > 0;
  }

  vue.addEventListener("click", event => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;

    if (action === "valider") Store.setDonationStatut(id, "Disponible");
    if (action === "lever") Store.setDonationStatut(id, "Disponible");
    if (action === "refuser") Store.setDonationStatut(id, "Refusé");

    if (action === "accepter") {
      const r = Store.setRequestStatut(id, "Acceptée");
      if (r) Store.setDonationStatut(r.donationId, "Réservé");
    }
    if (action === "finaliser") {
      const r = Store.setRequestStatut(id, "Finalisée");
      if (r) Store.setDonationStatut(r.donationId, "Remis");
    }
    if (action === "refuser-demande") {
      /* Le refus rend le don disponible pour les autres demandes. */
      Store.setRequestStatut(id, "Refusée");
    }

    afficher();
  });

  afficher();
}

if (state.erreur) {
  const note = document.createElement("p");
  note.className = "notice notice-erreur";
  note.textContent = state.erreur;
  document.querySelector("#contenu").prepend(note);
}
