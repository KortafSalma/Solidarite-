/* Proposer un don : validation client et enregistrement local (démo). */

"use strict";

const state = Store.load();
majHeaderSession();

const form = document.querySelector("#form-don");
const succes = document.querySelector("#notice-succes");
const echec = document.querySelector("#notice-echec");
const preview = document.querySelector("#preview-image");
let imageDataURL = null;

/* Aperçu de l'image (sans envoi, tout reste local) */
document.querySelector("#don-image").addEventListener("change", event => {
  const fichier = event.target.files && event.target.files[0];
  const errImage = document.querySelector("#err-image");
  errImage.hidden = true;
  event.target.removeAttribute("aria-invalid");
  preview.hidden = true;
  imageDataURL = null;

  if (!fichier) return;

  if (!/image\/(jpeg|png|webp)/.test(fichier.type) || fichier.size > 1.5 * 1024 * 1024) {
    errImage.hidden = false;
    event.target.setAttribute("aria-invalid", "true");
    return;
  }

  const lecteur = new FileReader();
  lecteur.onload = () => {
    imageDataURL = lecteur.result;
    preview.src = imageDataURL;
    preview.hidden = false;
  };
  lecteur.readAsDataURL(fichier);
});

function montrerErreur(champ, idErreur, condition) {
  const err = document.querySelector(idErreur);
  err.hidden = !condition;
  champ.setAttribute("aria-invalid", condition ? "true" : "false");
  return condition;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const titre = document.querySelector("#don-titre");
  const categorie = document.querySelector("#don-categorie");
  const etat = document.querySelector("#don-etat");
  const quartier = document.querySelector("#don-quartier");
  const description = document.querySelector("#don-description");

  let faux = false;
  faux = montrerErreur(titre, "#err-titre", titre.value.trim().length < 8) || faux;
  faux = montrerErreur(categorie, "#err-categorie", !categorie.value) || faux;
  faux = montrerErreur(etat, "#err-etat", !etat.value) || faux;
  faux = montrerErreur(quartier, "#err-quartier", !quartier.value) || faux;
  faux = montrerErreur(description, "#err-description", description.value.trim().length < 30) || faux;

  echec.hidden = !faux;

  if (faux) {
    const premier = form.querySelector('[aria-invalid="true"]');
    premier.focus();
    return;
  }

  const { donation, ok } = Store.addDonation({
    titre: titre.value.trim(),
    categorie: categorie.value,
    etat: etat.value,
    quartier: quartier.value,
    description: description.value.trim(),
    image: imageDataURL
  });

  form.closest(".publier").hidden = true;
  echec.hidden = true;
  succes.hidden = false;
  succes.scrollIntoView({ block: "center", behavior: "smooth" });

  const suite = document.querySelector("#succes-lien");
  if (!ok) {
    suite.innerHTML = `Attention : ${escapeHTML(state.erreur || "l'enregistrement local a échoué")} L'annonce ne sera pas visible dans les autres pages de la démo.`;
  } else {
    suite.innerHTML = `Numéro de registre : <b>N° ${escapeHTML(donation.no)}</b>. <a href="don.html?id=${encodeURIComponent(donation.id)}">Ouvrir la fiche de l'annonce</a> ou <a href="association.html">voir sa validation côté association</a>.`;
  }
});
