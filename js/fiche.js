/* Fiche d'annonce : lecture des données, demande de don (démo). */

"use strict";

const state = Store.load();
majHeaderSession();

const params = new URLSearchParams(location.search);
const id = params.get("id");
const don = id ? Store.getDonation(id) : null;

const fiche = document.querySelector("#fiche");
const introuvable = document.querySelector("#introuvable");
const autres = document.querySelector("#autres");
const sectionAutres = document.querySelector("#section-autres");

if (!don || ["En attente", "Refusé"].includes(don.statut)) {
  introuvable.hidden = false;
  sectionAutres.hidden = true;
  document.title = "Annonce introuvable | Solidarité+";
} else {
  document.title = `${don.titre} | Solidarité+`;
  fiche.hidden = false;

  document.querySelector("#fil-titre").textContent = `N° ${don.no}`;
  document.querySelector("#fiche-num").textContent = `N° ${don.no}, publiée le ${fmtDate(don.date)}`;
  document.querySelector("#fiche-titre").textContent = don.titre;
  document.querySelector("#fiche-description").textContent = don.description;
  document.querySelector("#fiche-categorie").textContent = don.categorie;
  document.querySelector("#fiche-etat").textContent = don.etat;
  document.querySelector("#fiche-quartier").textContent = don.quartier;
  document.querySelector("#fiche-date").textContent = fmtDate(don.date);
  document.querySelector("#fiche-donneur").textContent = don.donneur;
  document.querySelector("#fiche-statut").innerHTML = chipStatutDon(don.statut);

  /* Photo fournie s'il y en a une, sinon illustration de la catégorie. */
  const illustration = don.image || IMG_PAR_CATEGORIE[don.categorie] || null;
  if (illustration) {
    const estPhotoUtilisateur = Boolean(don.image);
    const figure = document.createElement("figure");
    figure.className = "detail-figure";
    figure.innerHTML = `
      <img src="${escapeHTML(illustration)}" alt="${estPhotoUtilisateur ? "Photo de l'objet" : `Illustration de la catégorie ${escapeHTML(don.categorie)}`}" width="800" height="600" loading="lazy">
      <figcaption>${estPhotoUtilisateur ? "Photo fournie par le donneur (conservée dans ce navigateur)." : `Illustration de la catégorie « ${escapeHTML(don.categorie)} » (prototype) : ce n'est pas la photo de l'objet réel.`}</figcaption>`;
    document.querySelector("#fiche-titre").parentElement.insertBefore(figure, document.querySelector("#fiche-titre"));
  }

  /* Encart de demande */
  const encart = document.querySelector("#encart-demande");
  const statutEncart = document.querySelector("#encart-statut");
  const formDemande = document.querySelector("#form-demande");
  const confirmee = document.querySelector("#demande-confirmee");
  const indispo = document.querySelector("#encart-indisponible");

  statutEncart.outerHTML = chipStatutDon(don.statut);

  const demandable = don.statut === "Disponible";
  const dejaDemandee = Store.aDejaDemande(don.id);

  if (!demandable) {
    indispo.hidden = false;
    formDemande.hidden = true;
    document.querySelector(".titre-encart").textContent = "Demander ce don n'est pas possible";
    document.querySelector("#encart-explication").textContent = "Le statut de cette annonce ne permet pas une nouvelle demande. Le registre reste ouvert pour les autres entrées.";
  } else if (dejaDemandee) {
    formDemande.hidden = true;
    confirmee.hidden = false;
    document.querySelector(".titre-encart").textContent = "Votre demande est déjà enregistrée (démo)";
  }

  formDemande.addEventListener("submit", event => {
    event.preventDefault();
    const nom = formDemande.querySelector("#req-nom");
    const err = document.querySelector("#req-nom-err");

    if (!nom.value.trim()) {
      err.hidden = false;
      nom.setAttribute("aria-invalid", "true");
      nom.focus();
      return;
    }
    err.hidden = true;
    nom.removeAttribute("aria-invalid");

    const { request, ok } = Store.addRequest(don.id, formDemande.querySelector("#req-note").value.trim());
    formDemande.hidden = true;
    confirmee.hidden = false;
    if (!ok) {
      confirmee.innerHTML = `<p><b>Demande enregistrée pour cette session (démonstration).</b> L'enregistrement local a échoué : elle ne survivra pas à cette page. ${state.erreur || ""}</p>`;
    }
    confirmee.setAttribute("data-id", request.id);
  });

  /* Deux autres entrées du registre */
  const autresEntrees = Store.donationsPubliques()
    .filter(d => d.id !== don.id && ["Disponible", "Réservé"].includes(d.statut))
    .sort((a, b) => b.no.localeCompare(a.no))
    .slice(0, 3);
  autres.innerHTML = autresEntrees.map(d => ligneRegistre(d, true)).join("");
}
