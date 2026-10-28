/* Solidarité+ : magasin local (mode démonstration).
   Tout est stocké dans le localStorage de ce navigateur.
   Rien n'est envoyé à un serveur. Si le stockage est indisponible,
   la page affiche un état d'erreur clair. */

"use strict";

const CLE_STORAGE = "solidrite-plus-demo-v1";

const Store = (() => {
  let dispo = true;
  let msgErreurStorage = "";

  function brut() {
    let etat = null;
    try {
      etat = window.localStorage.getItem(CLE_STORAGE);
    } catch (e) {
      dispo = false;
      msgErreurStorage = "Le stockage local de ce navigateur est indisponible (mode privé ou permissions) : les données de démonstration ne sont pas enregistrées entre deux pages.";
      return { donations: [], requests: [], session: null };
    }
    if (!etat) return null;
    try {
      return JSON.parse(etat);
    } catch (e) {
      return null;
    }
  }

  function init() {
    const etat = brut();
    if (!etat) {
      return {
        dispo,
        erreur: msgErreurStorage,
        data: {
          donations: DEMO_DONATIONS.map(d => ({ ...d, origin: "exemple" })),
          requests: DEMO_REQUESTS.map(r => ({ ...r, origin: "exemple" })),
          session: null
        }
      };
    }
    return {
      dispo,
      erreur: msgErreurStorage,
      data: {
        donations: etat.donations || DEMO_DONATIONS.map(d => ({ ...d, origin: "exemple" })),
        requests: etat.requests || DEMO_REQUESTS.map(r => ({ ...r, origin: "exemple" })),
        session: etat.session || null
      }
    };
  }

  function enregistrer(data) {
    try {
      window.localStorage.setItem(CLE_STORAGE, JSON.stringify(data));
      return true;
    } catch (e) {
      msgErreurStorage = "L'enregistrement local a échoué (quota ou permissions) : la donnée reste affichée sur cette page mais ne sera pas conservée.";
      dispo = false;
      return false;
    }
  }

  let state = null;

  function load() {
    const { dispo: ok, erreur, data } = init();
    state = data;
    state.dispo = ok;
    state.erreur = erreur;
    return state;
  }

  function save() {
    const ok = enregistrer(state);
    if (!ok) state.dispo = false;
    return ok;
  }

  function idUtilisateur(prefixe) {
    return prefixe + "u" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
  }

  /* Donations */
  function allDonations() {
    return state.donations;
  }

  function donationsPubliques() {
    // Le répertoire public n'expose ni "En attente" ni "Refusé".
    return state.donations.filter(d => !["En attente", "Refusé"].includes(d.statut));
  }

  function getDonation(id) {
    return state.donations.find(d => d.id === id) || null;
  }

  function setDonationStatut(id, statut) {
    const d = getDonation(id);
    if (d) {
      d.statut = statut;
      save();
    }
    return d;
  }

  function addDonation(entree) {
    const nums = state.donations.map(d => Number(d.no) || 0);
    const no = String(Math.max(...nums, 0) + 1).padStart(3, "0");
    const donation = {
      id: idUtilisateur("d"),
      no,
      titre: entree.titre,
      categorie: entree.categorie,
      etat: entree.etat,
      quartier: entree.quartier,
      date: new Date().toISOString().slice(0, 10),
      statut: "En attente",
      description: entree.description,
      image: entree.image || null,
      donneur: state.session ? state.session.nom : "Anonyme (démo)",
      origin: "vous"
    };
    state.donations.push(donation);
    const ok = save();
    return { donation, ok };
  }

  /* Demandes */
  function allRequests() {
    return state.requests;
  }

  function getDonationSafe(id) {
    return getDonation(id) || { titre: "Annonce retirée (démo)", categorie: "", quartier: "" };
  }

  function requestsDe(donationId) {
    return state.requests.filter(r => r.donationId === donationId);
  }

  function aDejaDemande(donationId) {
    return state.requests.some(r => r.donationId === donationId && r.origin === "vous" && r.statut !== "Refusée");
  }

  function addRequest(donationId, note) {
    const request = {
      id: idUtilisateur("r"),
      donationId,
      donneurNom: state.session ? state.session.nom : "Anonyme (démo)",
      date: new Date().toISOString().slice(0, 10),
      statut: "Attente",
      note: note || "",
      origin: "vous"
    };
    state.requests.push(request);
    const ok = save();
    return { request, ok };
  }

  function setRequestStatut(id, statut) {
    const r = state.requests.find(x => x.id === id);
    if (r) {
      r.statut = statut;
      save();
    }
    return r;
  }

  /* Session (démo) */
  function getSession() {
    return state.session;
  }

  function setSession(nom, role) {
    state.session = { nom, role };
    save();
  }

  function clearSession() {
    state.session = null;
    save();
  }

  return {
    load, save,
    allDonations, donationsPubliques, getDonation, setDonationStatut, addDonation,
    allRequests, getDonationSafe, requestsDe, aDejaDemande, addRequest, setRequestStatut,
    getSession, setSession, clearSession
  };
})();

/* Utilitaires partagés */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => "&#" + char.charCodeAt(0) + ";");
}

function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      .format(new Date(iso + "T12:00:00"));
  } catch (e) {
    return iso;
  }
}

function chipStatutDon(statut) {
  const info = STATUT_DON[statut] || { mot: statut, classe: "" };
  return `<span class="statut ${info.classe}">${escapeHTML(info.mot)}</span>`;
}

const STATUT_REQ = {
  "Attente":   { mot: "En attente", classe: "statut-attente" },
  "Acceptée":  { mot: "Acceptée", classe: "statut-acceptee" },
  "Refusée":   { mot: "Refusée", classe: "statut-remis" },
  "Finalisée": { mot: "Finalisée", classe: "statut-finalisee" }
};

function chipStatutReq(statut) {
  const info = STATUT_REQ[statut] || { mot: statut, classe: "" };
  return `<span class="statut ${info.classe}">${escapeHTML(info.mot)}</span>`;
}

/* Ligne de registre (répertoire réutilisé par l'accueil) */
function ligneRegistre(d, avecAction = true) {
  const href = "don.html?id=" + encodeURIComponent(d.id);
  const vignette = IMG_PAR_CATEGORIE[d.categorie]
    ? `<a class="annonce-vignette" href="${href}" tabindex="-1" aria-hidden="true"><img src="${escapeHTML(IMG_PAR_CATEGORIE[d.categorie])}" alt="" width="120" height="90" loading="lazy"></a>`
    : `<span class="annonce-vignette" aria-hidden="true"></span>`;
  return `
    <article class="annonce">
      ${vignette}
      <a href="${href}"><h3>${escapeHTML(d.titre)}</h3></a>
      <p class="meta meta-area"><b>${escapeHTML(d.categorie)}</b> quartier ${escapeHTML(d.quartier)}</p>
      <p class="annonce-date"><time datetime="${escapeHTML(d.date)}">${fmtDate(d.date)}</time></p>
      <span class="annonce-fin">${chipStatutDon(d.statut)}${avecAction ? `<a href="${href}" class="btn-quiet">Voir l'annonce</a>` : ""}</span>
    </article>`;
}

/* Carte de demande (Mes demandes, tableau de bord, association) */
function carteDemande(r, exemple = false) {
  const don = Store.getDonationSafe(r.donationId);
  const href = r.donationId && Store.getDonation(r.donationId) ? `don.html?id=${encodeURIComponent(r.donationId)}` : "dons.html";
  return `
    <article class="carte-ligne">
      <div>
        <h3><a href="${href}">${escapeHTML(don.titre)}</a></h3>
        <p class="meta">Demande envoyée le ${fmtDate(r.date)} par <b>${escapeHTML(r.donneurNom)}</b>${r.note ? `, " ${escapeHTML(r.note)} "` : ""}${exemple ? ", demande fictive fournie en exemple" : ""}</p>
      </div>
      <div>${chipStatutReq(r.statut)}</div>
      <p class="meta actions-suite">${statutExplication(r.statut)}</p>
    </article>`;
}

function statutExplication(statut) {
  const cartes = {
    "Attente": "Le donneur ou l'association n'a pas encore répondu (démonstration).",
    "Acceptée": "Réponse positive : préparez la remise en main propre, sans paiement.",
    "Refusée": "L'annonce a été retenue pour une autre demande. Chercher ailleurs est gratuit.",
    "Finalisée": "L'objet a été remis en main propre. La demande est close."
  };
  return cartes[statut] || "";
}

/* Onglets accessibles (tableau de bord, etc.) */function initOnglets(root) {
  root.querySelectorAll(".onglets").forEach(groupe => {
    const boutons = [...groupe.querySelectorAll("button")];
    boutons.forEach(btn => {
      btn.addEventListener("click", () => {
        boutons.forEach(b => b.setAttribute("aria-selected", String(b === btn)));
        const cible = btn.getAttribute("data-panneau");
        document.querySelectorAll(".panneau").forEach(p => p.hidden = p.id !== cible);
      });
    });
  });
}

/* Session dans l'en-tête */
function majHeaderSession() {
  const chip = document.querySelector(".session-chip");
  if (!chip) return;
  const s = Store.getSession();
  if (s) {
    chip.innerHTML = `Connecté : <b>${escapeHTML(s.nom)}</b> (${escapeHTML(s.role)}), session de démonstration`;
  } else {
    chip.innerHTML = "";
  }
}
