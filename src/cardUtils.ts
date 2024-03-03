import { Card, Player, Table } from "./GameTypes";

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

const CARD_VALUE_TO_TITLE_MAP = {
  1: "Dalmuti",
  2: "Archbishop",
  3: "Earl Marshal",
  4: "Baroness",
  5: "Abbess",
  6: "Knight",
  7: "Seamstress",
  8: "Mason",
  9: "Cook",
  10: "Shepherdess",
  11: "Stonecutter",
  12: "Peasants",
  13: "Jester"
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
      deck.push({
        value: Number(key),
        title:
          CARD_VALUE_TO_TITLE_MAP[
            key as unknown as keyof typeof CARD_VALUE_TO_COUNT_MAP
          ]
      });
    }
  });

  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffledDeck: Card[] = deck.slice();

  for (let x = deck.length - 1; x >= 0; x--) {
    const j = Math.floor(Math.random() * x + 1);

    const temp = shuffledDeck[x];
    shuffledDeck[x] = shuffledDeck[j];
    shuffledDeck[j] = temp;
  }

  return shuffledDeck;
};

export const getNewShuffledDeck = (): Card[] => {
  return shuffleDeck(getStartingDeck());
};

export const dealCardsForStartingOrder = (table: Table): void => {
  const deck = getNewShuffledDeck();

  let currentCardIndex = deck.length - 1;

  for (let x = 0; x < table.players.length; x++) {
    table.players[x].startingOrderCard = deck[currentCardIndex];
    currentCardIndex--;
  }
};

export const cardComparator = (cardA: Card, cardB: Card): number => {
  return cardA.value - cardB.value;
};

export const cardsAllMatch = (cards: Card[]): boolean => {
  return (
    cards.filter((C: Card) => C.value === cards[0].value || C.value === 13)
      .length === cards.length
  );
};

export const isAllJokers = (move: Card[]): boolean => {
  if (move.find((C: Card) => C.value !== 13)) return false;
  return true;
};

export const hasCards = (player: Player, cards: Card[]): boolean => {
  const cardsFound = player.cards.filter(
    (C: Card) => C.value === cards[0].value
  ).length;

  return cardsFound === cards.length;
};

export const getFirstNonJokerCard = (trick: Card[]): Card => {
  trick.forEach((C: Card) => {
    if (C.value !== 13) {
      return C;
    }
  });

  throw new Error("Move was empty. Not good");
};
