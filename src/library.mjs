import { sampleDecks } from './sample-decks.mjs';
import { newDecks } from './new-decks.mjs';
import { expansions } from './expansions.mjs';
import { bonusDecks } from './bonus-decks.mjs';

// Keep every original slide, in order. Insert topic-specific developments before the callback.
function extend(deck, collection) {
  const b = deck.slides, e = expansions[deck.id];
  if (!e || b.length + e.length !== 10) throw new Error(`Missing expansion: ${deck.id}`);
  const slides = [b[0], b[1], e[0], b[2], b[3], e[1], b[4], e[2], e[3], b[5]];
  return { ...deck, collection, slides };
}
export const sourceLibrary = sampleDecks.map(d => extend(d, 'source'));
export const newLibrary = [...newDecks.map(d => extend(d, 'new')), ...bonusDecks];
export const library = [...sourceLibrary, ...newLibrary];
export const shortLibrary = [...sampleDecks, ...newDecks];
