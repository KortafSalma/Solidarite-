/* Solidarité+ : données de démonstration (écrites à la main, fictives).
   Aucune donnée ici ne représente une personne ou un objet réel. */

const CATEGORIES = [
  "Vêtements",
  "Fournitures scolaires",
  "Hygiène",
  "Alimentation non périssable",
  "Articles ménagers"
];

const QUARTIERS = [
  "Casablanca, Hay Hassani",
  "Casablanca, Hay Mohammadi",
  "Casablanca, Aïn Chock",
  "Rabat, Agdal",
  "Rabat, Takaddoum",
  "Mohammedia, Al Majd",
  "Mohammedia, El Alia",
  "Settat, centre-ville"
];

const ETAT = ["Excellent", "Bon", "Moyen"];

/* Illustrations vectorielles du prototype, une par catégorie.
   Remplaçables par de vraies photographies : éditez ce tableau. */
const IMG_PAR_CATEGORIE = {
  "Vêtements": "assets/img/vetements.svg",
  "Fournitures scolaires": "assets/img/scolaires.svg",
  "Hygiène": "assets/img/hygene.svg",
  "Alimentation non périssable": "assets/img/alimentation.svg",
  "Articles ménagers": "assets/img/menagers.svg"
};

/* Donations de démonstration. statut : Disponible, Réservé, Remis,
   En attente (validation par association), Refusé, Signalé. */
const DEMO_DONATIONS = [
  {
    id: "d001", no: "001",
    titre: "Équipement de sport enfant (lot de maillots)",
    categorie: "Vêtements",
    etat: "Bon",
    quartier: "Casablanca, Hay Hassani",
    date: "2026-10-08",
    statut: "Disponible",
    description: "Six maillots de sport enfants, lavés, taille 10 à 12 ans. Couleurs vives, aucune tache visible.",
    image: null,
    donneur: "Donneur de démonstration"
  },
  {
    id: "d002", no: "002",
    titre: "Vaisselle complète pour une famille",
    categorie: "Articles ménagers",
    etat: "Bon",
    quartier: "Casablanca, Hay Mohammadi",
    date: "2026-10-09",
    statut: "Remis",
    description: "Quatre assiettes, quatre bols, deux casseroles et une cafetière. Rien de cassé, tout fonctionne.",
    image: null,
    donneur: "Donneur de démonstration"
  },
  {
    id: "d003", no: "003",
    titre: "Couvertures polaires, comme neuves",
    categorie: "Articles ménagers",
    etat: "Excellent",
    quartier: "Settat, centre-ville",
    date: "2026-10-10",
    statut: "Signalé",
    motif: "Raisons de signalement à vérifier par le modérateur : description sans détail, photo illustrative.",
    description: "Deux couvertures polaires. La description de cette annonce est volontairement incomplète pour illustrer la modération.",
    image: null,
    donneur: "Donneur de démonstration"
  },
  {
    id: "d004", no: "004",
    titre: "Cahiers de brouillon, peu remplis",
    categorie: "Fournitures scolaires",
    etat: "Moyen",
    quartier: "Rabat, Takaddoum",
    date: "2026-10-12",
    statut: "Disponible",
    description: "Huit cahiers utilisés aux deux tiers seulement. Pages propres disponibles pour du brouillon.",
    image: null,
    donneur: "Donneur de démonstration"
  },
  {
    id: "d005", no: "005",
    titre: "Savons et gels douche, scellés",
    categorie: "Hygiène",
    etat: "Excellent",
    quartier: "Mohammedia, Al Majd",
    date: "2026-10-13",
    statut: "Disponible",
    description: "Dix savons neufs scellés et trois gels douche jamais ouverts. Retirés d'un lot commercial.",
    image: null,
    donneur: "Donneur de démonstration"
  },
  {
    id: "d006", no: "006",
    titre: "Couches, taille 4",
    categorie: "Hygiène",
    etat: "Excellent",
    quartier: "Casablanca, Aïn Chock",
    date: "2026-10-14",
    statut: "Disponible",
    description: "Un paquet de quarante couches taille 4, scellé, acheté en double par erreur.",
    image: null,
    donneur: "Donneur de démonstration"
  },
  {
    id: "d007", no: "007",
    titre: "Chemises homme, lavées et repassées",
    categorie: "Vêtements",
    etat: "Bon",
    quartier: "Rabat, Takaddoum",
    date: "2026-10-16",
    statut: "Disponible",
    description: "Quatre chemises taille L et M, repassées, sans trous ni taches. Coton uni et rayé.",
    image: null,
    donneur: "Donneur de démonstration"
  },
  {
    id: "d008", no: "008",
    titre: "Farine de blé, sachets scellés",
    categorie: "Alimentation non périssable",
    etat: "Excellent",
    quartier: "Rabat, Agdal",
    date: "2026-10-18",
    statut: "Disponible",
    description: "Quatre sachets de farine de 5 kg, dates de conservation 2027 vérifiées, jamais ouverts.",
    image: null,
    donneur: "Donneur de démonstration"
  },
  {
    id: "d009", no: "009",
    titre: "Manuels de français, cycle secondaire",
    categorie: "Fournitures scolaires",
    etat: "Bon",
    quartier: "Mohammedia, El Alia",
    date: "2026-10-20",
    statut: "En attente",
    description: "Sept manuels de français du collège au lycée. La publication attend la validation d'une association.",
    image: null,
    donneur: "Donneur de démonstration"
  },
  {
    id: "d010", no: "010",
    titre: "Riz, lentilles et conserves (panier de base)",
    categorie: "Alimentation non périssable",
    etat: "Excellent",
    quartier: "Casablanca, Hay Mohammadi",
    date: "2026-10-21",
    statut: "Réservé",
    description: "Un panier complet : 5 kg de riz, 2 kg de lentilles, six conserves. Toutes les dates de conservation sont indiquées sur les paquets.",
    image: null,
    donneur: "Donneur de démonstration"
  },
  {
    id: "d011", no: "011",
    titre: "Cartables scolaires, lot de quatre",
    categorie: "Fournitures scolaires",
    etat: "Bon",
    quartier: "Rabat, Agdal",
    date: "2026-10-23",
    statut: "Disponible",
    description: "Quatre cartables d'écolier, fermetures testées, deux avec une trousse offerte.",
    image: null,
    donneur: "Donneur de démonstration"
  },
  {
    id: "d012", no: "012",
    titre: "Manteaux d'hiver, tailles 10 à 14 ans",
    categorie: "Vêtements",
    etat: "Bon",
    quartier: "Casablanca, Hay Hassani",
    date: "2026-10-26",
    statut: "Disponible",
    description: "Deux manteaux d'hiver enfants, lavés. Porter une saison, taches non visibles.",
    image: null,
    donneur: "Donneur de démonstration"
  }
];

/* Demandes de démonstration, pour illustrer les statuts. */
const DEMO_REQUESTS = [
  {
    id: "r001",
    donationId: "d001",
    donneurNom: "Yassine (exemple)",
    date: "2026-10-09",
    statut: "Finalisée",
    note: "Utile pour un club de foot du quartier."
  },
  {
    id: "r002",
    donationId: "d010",
    donneurNom: "Anas (exemple)",
    date: "2026-10-20",
    statut: "Acceptée",
    note: "Je viens chercher le panier en transport en commun."
  },
  {
    id: "r003",
    donationId: "d011",
    donneurNom: "Salma (exemple)",
    date: "2026-10-23",
    statut: "Attente",
    note: "Cartable pour la rentrée en janvier d'un cousin."
  },
  {
    id: "r004",
    donationId: "d006",
    donneurNom: "Karim (exemple)",
    date: "2026-10-15",
    statut: "Refusée",
    note: "Beaucoup de demandes pour ce lot, déjà pris en charge."
  }
];

/* Libellés de statut affichés pour les donations. */
const STATUT_DON = {
  "Disponible": { mot: "Disponible", classe: "statut-disponible" },
  "Réservé":    { mot: "Réservé", classe: "statut-reserve" },
  "Remis":      { mot: "Remis", classe: "statut-remis" },
  "En attente": { mot: "En attente", classe: "statut-attente" },
  "Refusé":     { mot: "Refusé", classe: "statut-remis" },
  "Signalé":    { mot: "Signalé", classe: "statut-signale" }
};
