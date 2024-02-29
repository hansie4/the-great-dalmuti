import { Card } from './GameTypes';

const CARD_VALUE_TO_COUNT_MAP = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  13: 2
};

export const getStartingDeck = (): Card[] => {
  const deck: Card[] = [];

  Object.keys(CARD_VALUE_TO_COUNT_MAP).forEach((key) => {
    for (
      let x = 0;
      x <
      CARD_VALUE_TO_COUNT_MAP[
        key as unknown as keyof typeof CARD_VALUE_TO_COUNT_MAP
      ];
      x++
    ) {
      deck.push({ value: Number(key) });
    }
  });

  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffledDeck: Card[] = deck.slice();

  for (let x = deck.length - 1; x > 0; x--) {
    const j = Math.floor(Math.random() * x + 1);

    const temp = shuffledDeck[x];
    shuffledDeck[x] = shuffledDeck[j];
    shuffledDeck[j] = temp;
  }

  return deck;
};
