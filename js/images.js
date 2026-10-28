/* Solidarité+ : photos facultatives avec repli propre.
   Si une image n'existe pas (assets/img vide, téléchargement impossible),
   la figure qui la contient disparaît : jamais d'image cassée à l'écran. */

"use strict";

window.addEventListener("error", event => {
  const img = event.target;
  if (img && img.tagName === "IMG") {
    const figure = img.closest("figure");
    if (figure) figure.hidden = true;
  }
}, true);
