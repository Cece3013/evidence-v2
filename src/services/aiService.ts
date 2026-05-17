import { ROOM_TYPES, CHAMBRE_SUBTYPES } from '../constants';

interface PromptParams {
  roomTypeId: string;
  roomSubTypeId?: string;
  decoStyleId: string;
  angleId?: string;
}

export function buildHomeStagingPrompt(roomTypeId: string, roomSubTypeId?: string): string {
  const room = ROOM_TYPES.find((r) => r.id === roomTypeId);
  const subType = CHAMBRE_SUBTYPES?.find((s) => s.id === roomSubTypeId);
  const roomLabel = subType ? `${subType.label}` : room?.label || "pièce";

  return `Tu es un expert en home staging immobilier professionnel.
Tu transformes virtuellement cette photo d'un(e) ${roomLabel} VIDE pour aider à la vente immobilière.

RÈGLES ABSOLUES — HOME STAGING VENDEUR :
- Neutralité maximale : couleurs blanches, beiges, grises claires uniquement
- Mobilier standard immobilier : canapé 3 places neutre, table basse sobre, tapis clair
- Aucune déco personnalisée : pas de bibelots, pas de couleurs vives, pas de style marqué
- Lumière renforcée : maximiser la luminosité perçue, clarifier les zones sombres
- Objectif projection acheteur universel : doit plaire au plus grand nombre
- Suppression de tout style décoratif marqué (pas de scandinave, industriel, bohème...)

LES 7 PRINCIPES DU HOME STAGING À APPLIQUER :
1. Désencombrer — espace aéré, aucun surplus
2. Dépersonnaliser — neutre, universel
3. Luminosité — maximiser la lumière perçue
4. Réaménager — fluidité de circulation, volumes mis en valeur
5. Harmoniser — couleurs douces, cohérentes
6. Mettre en scène — touches chaleureuses sobres (coussin beige, plante verte discrète)
7. Optimiser chaque pièce selon son usage

GUIDE PAR TYPE DE PIÈCE — ${roomLabel.toUpperCase()} :
${getRoomGuide(roomTypeId)}

NEGATIVE PROMPT STRICT :
- Pas de meubles irréalistes ou disproportionnés
- Pas de couleurs vives ou décoration personnalisée
- Pas de modifications architecturales
- Pas d'effet cartoon ou illustration
- Pas de surcharge décorative
- Pas de style marqué (scandinave, industriel, bohème, baroque...)

RÉSULTAT ATTENDU :
Une projection visuelle neutre, lumineuse et universelle.
L'acheteur doit pouvoir se projeter immédiatement, tous les acheteurs potentiels doivent être séduits.
On accélère la vente immobilière grâce à la projection visuelle.
On transforme ce bien vide en espace vendable.
On ne modifie pas la structure du logement.
On ne modife pas l'emplacement des fenêtres et portes, ni leur taille.
One ne modifie pas les éléments architectuiraux (moulures, cheminées, etc).
One ne modifie pas les couleurs des murs, sols et plafonds.
On n'ajoute pas de meubles ou éléments décoratifs qui ne sont pas satndard dans une mise en scène immobilière neutre.
On n'ajoute pas de meubles ou éléments décoratifs qui ne sont pas réalistes pour la pièce.
On n'ajoute pas de meubles ou éléments décoratifs qui ne sont pas proportionnés à la pièce.
On n'ajoute pas de meubles ou éléments décoratifs qui ne sont pas adaptés à l'usage de la pièce.
On n'ajoute pas de meubles ou éléments décoratifs qui ne sont pas adaptés à la pièce (ex. pas de canapé dans la cuisine).
On n'ajoute pas de meubles ou éléments décoratifs qui ne sont pas adaptés à un style neutre et universel.
On ne modifie pas les surfaces vitrées (fenêtres, baies) pour ne pas altérer la luminosité naturelle.
on ne modifie pas les éléments de structure (murs porteurs, cloisons) pour ne pas altérer la configuration du logement.
On ne modifie pas les éléments de plomberie ou d'électricité visibles (robinets, prises) pour ne pas altérer la réalité du logement.
On ne modifie pas les éléments de chauffage visibles (radiateurs, climatiseurs) pour ne pas altérer la réalité du logement.
On ne modifie pas les éléments de rangement visibles (placards, étagères) pour ne pas altérer la réalité du logement.
On ne modifie pas les éléments de décoration existants qui sont neutres et universels (ex.une cheminée en marbre blanc)pour ne pas altérer la réalité du logement.`;
}

function getRoomGuide(roomTypeId: string): string {
  const guides: Record<string, string> = {
    salon: "Alléger les meubles, maximiser lumière naturelle, créer ambiance chaleureuse neutre. Provoquer le coup de cœur.",
    chambre: "Literie soignée (blanc/beige), couleurs douces, espace apaisant. Limiter les meubles. Sensation de calme.",
    cuisine: "Plan de travail dégagé, propreté impeccable, rangements organisés, touches déco sobres. Rassurer immédiatement.",
    salle_bain: "Serviettes neutres, accessoires minimalistes, odeur fraîche suggérée. Ne pas bloquer la vente.",
    bureau: "Espace simple et ordonné, lumière naturelle, ambiance productive mais neutre. Télétravail valorisé.",
    entree: "Espace dégagé, lumière agréable, miroir si possible. Première impression décisive.",
    salle_manger: "Table sobre dressée, chaises neutres, lumière naturelle. Convivialité universelle.",
    terrasse: "Mobilier simple rangé, plantes propres, entrée valorisée. L'extérieur vend avant la visite.",
    suite_parentale: "Espace cocon, lumière douce, literie premium neutre. Luxe accessible.",
  };
  return guides[roomTypeId] || "Neutralité, lumière, projection acheteur universel.";
}

export const buildAnalysisPrompt = buildHomeStagingPrompt;

