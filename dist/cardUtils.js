"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleDeck = exports.getStartingDeck = void 0;
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
const getStartingDeck = () => {
    const deck = [];
    Object.keys(CARD_VALUE_TO_COUNT_MAP).forEach((key) => {
        for (let x = 0; x <
            CARD_VALUE_TO_COUNT_MAP[key]; x++) {
            deck.push({ value: Number(key) });
        }
    });
    return deck;
};
exports.getStartingDeck = getStartingDeck;
const shuffleDeck = (deck) => {
    const shuffledDeck = deck.slice();
    for (let x = deck.length - 1; x > 0; x--) {
        const j = Math.floor(Math.random() * x + 1);
        const temp = shuffledDeck[x];
        shuffledDeck[x] = shuffledDeck[j];
        shuffledDeck[j] = temp;
    }
    return deck;
};
exports.shuffleDeck = shuffleDeck;
//# sourceMappingURL=cardUtils.js.map