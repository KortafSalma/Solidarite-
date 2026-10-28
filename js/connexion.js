/* Connexion de démonstration : session locale, sans mot de passe. */

"use strict";

const state = Store.load();
majHeaderSession();

const form = document.querySelector("#form-session");
const confirmee = document.querySelector("#session-confirmee");
const existante = document.querySelector("#session-existante");
const champNom = document.querySelector("#session-nom");
const champRole = document.querySelector("#session-role");

/* Le lien de l'espace association pré-sélectionne le rôle. */
const params = new URLSearchParams(location.search);
if (params.get("role")) {
  const role = params.get("role");
  [...champRole.options].forEach(o => { if (o.value === role) o.selected = true; });
}

function majVue() {
  const s = Store.getSession();
  if (s) {
    existante.hidden = false;
    confirmee.hidden = false;
    document.querySelector("#session-courante").textContent = `${s.nom} (rôle : ${s.role})`;
    champNom.value = s.nom;
    [...champRole.options].forEach(o => { if (o.value === s.role) o.selected = true; });
  } else {
    existante.hidden = true;
    confirmee.hidden = true;
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const err = document.querySelector("#err-nom");

  if (champNom.value.trim().length < 2) {
    err.hidden = false;
    champNom.setAttribute("aria-invalid", "true");
    champNom.focus();
    return;
  }
  err.hidden = true;
  champNom.removeAttribute("aria-invalid");

  Store.setSession(champNom.value.trim(), champRole.value);
  majVue();
});

document.querySelector("#deconnexion").addEventListener("click", () => {
  Store.clearSession();
  majVue();
  champNom.value = "";
});

majVue();

if (state.erreur) {
  const note = document.createElement("p");
  note.className = "notice notice-erreur";
  note.textContent = state.erreur;
  document.querySelector("#contenu").prepend(note);
}
