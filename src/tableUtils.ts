import { Card, Player, Table } from "./GameTypes";
import {
  cardComparator,
  cardsAllMatch,
  getFirstNonJokerCard,
  getNewShuffledDeck,
  hasCards,
  isAllJokers
} from "./cardUtils";
import { getDefaultPlayer } from "./gameUtils";

export const orderPlayersBasedOnStartingCard = (table: Table): void => {
  //table.players.reverse();
  table.players.sort((playerA: Player, PlayerB: Player): number => {
    const p1C = playerA.startingOrderCard ? playerA.startingOrderCard.value : 0;
    const p2C = PlayerB.startingOrderCard ? PlayerB.startingOrderCard.value : 0;

    return p1C - p2C;
  });

  table.players.forEach((P: Player) => {
    P.startingOrderCard = null;
  });
};

export const getPlayer = (table: Table, playerId: string): Player => {
  const player: Player | undefined = table.players.find(
    (P: Player) => P.socketId === playerId
  );

  if (!player) throw new Error("Invalid player id provided");

  return player;
};

export const getPlayerSeatId = (table: Table, playerId: string): number => {
  const seatNumber: number | undefined = table.players.findIndex(
    (P: Player) => P.socketId === playerId
  );

  if (seatNumber === undefined) throw new Error("Invalid player id provided");

  return seatNumber;
};

export const getTheGreaterDalmuti = (table: Table): Player => {
  return table.players[0];
};

export const getTheLesserDalmuti = (table: Table): Player => {
  return table.players[1];
};

export const getTheGreaterPeon = (table: Table): Player => {
  return table.players[table.players.length - 1];
};

export const getTheLesserPeon = (table: Table): Player => {
  return table.players[table.players.length - 2];
};

export const canPlayerCallForRevolution = (
  table: Table,
  playerId: string
): boolean => {
  const player: Player = getPlayer(table, playerId);

  const jokers = player.cards.filter((C) => C.value === 13);

  return jokers.length === 2 && playerId !== getTheGreaterPeon(table).socketId;
};

export const canPlayerCallForGreaterRevolution = (
  table: Table,
  playerId: string
): boolean => {
  const player: Player = getPlayer(table, playerId);

  const jokers = player.cards.filter((C) => C.value === 13);

  return jokers.length === 2 && playerId === getTheGreaterPeon(table).socketId;
};

export const callForGreaterRevolution = (table: Table): void => {
  table.players.reverse();
  table.greaterRevolutionWasCalled = true;
};

export const sortHands = (table: Table): void => {
  table.players.forEach(
    (P: Player) => (P.cards = P.cards.sort(cardComparator))
  );
};

export const dealCards = (table: Table): void => {
  const deck = getNewShuffledDeck();

  let currentPlayerIndex = 0;
  let currentCardIndex = deck.length - 1;

  while (currentCardIndex >= 0) {
    table.players[currentPlayerIndex].cards.push(deck[currentCardIndex]);

    currentCardIndex--;

    if (currentPlayerIndex === table.players.length - 1) {
      currentPlayerIndex = 0;
    } else {
      currentPlayerIndex++;
    }
  }

  sortHands(table);
};

export const getBestCardsFromHand = (
  player: Player,
  numCards: 1 | 2
): Card[] => {
  const cards = player.cards.slice();

  cards.sort(cardComparator);

  if (numCards === 1) return [cards[0]];
  return [cards[0], cards[1]];
};

export const populatePossibleTaxation = (table: Table): void => {
  const greaterDalmuti: Player = getTheGreaterDalmuti(table);
  const greaterPeon: Player = getTheGreaterPeon(table);
  const lesserDalmuti: Player = getTheLesserDalmuti(table);
  const lesserPeon: Player = getTheLesserPeon(table);

  const greaterPeonBestCards = getBestCardsFromHand(greaterPeon, 2);
  const lesserPeonBestCards = getBestCardsFromHand(lesserPeon, 1);

  greaterPeon.cards.shift();
  greaterPeon.cards.shift();

  lesserPeon.cards.shift();

  greaterDalmuti.possibleTradeCards = greaterPeonBestCards;
  lesserDalmuti.possibleTradeCards = lesserPeonBestCards;
};

const performTrade = (
  dalmuti: Player,
  peon: Player,
  indexesOfCardsToTake: number[],
  indexesOfCardsToTradeFromHand: number[]
): void => {
  indexesOfCardsToTake.forEach((cardIndex: number, I: number) => {
    const cardGoingToPeon: Card =
      dalmuti.cards[indexesOfCardsToTradeFromHand[I]];

    // Add the new card to the hand of the Peon
    peon.cards.push(cardGoingToPeon);

    // Remove the card from the hand of the Dalmuti
    dalmuti.cards.splice(indexesOfCardsToTradeFromHand[I], 1);

    // Add the new card to the hand of the Dalmuti
    dalmuti.cards.push(dalmuti.possibleTradeCards[cardIndex]);
  });

  // Cards not taken need to be put back in the peons hand
  dalmuti.possibleTradeCards.forEach((C: Card, I: number) => {
    if (
      indexesOfCardsToTake.find((index: number) => index === I) === undefined
    ) {
      peon.cards.push(C);
    }
  });
};

export const tradeCards = (
  table: Table,
  tradingPlayerId: string,
  indexesOfCardsToTradeFromHand: number[],
  indexesOfCardsToTake: number[]
): void => {
  const greaterDalmuti: Player = getTheGreaterDalmuti(table);
  const greaterPeon: Player = getTheGreaterPeon(table);
  const lesserDalmuti: Player = getTheLesserDalmuti(table);
  const lesserPeon: Player = getTheLesserPeon(table);

  if (indexesOfCardsToTake.length !== indexesOfCardsToTradeFromHand.length)
    throw new Error("Unfair trade trying to be made!");

  if (tradingPlayerId === greaterDalmuti.socketId) {
    performTrade(
      greaterDalmuti,
      greaterPeon,
      indexesOfCardsToTake,
      indexesOfCardsToTradeFromHand
    );

    greaterDalmuti.possibleTradeCards = [];

    sortHands(table);

    return;
  }

  if (tradingPlayerId === lesserDalmuti.socketId) {
    performTrade(
      lesserDalmuti,
      lesserPeon,
      indexesOfCardsToTake,
      indexesOfCardsToTradeFromHand
    );

    lesserDalmuti.possibleTradeCards = [];

    sortHands(table);

    return;
  }

  throw new Error("Non-Dalmuti player trying to trade");
};

export const validateHands = (table: Table): void => {
  const sum: number = table.players.reduce((acc: number, cur: Player) => {
    return (
      acc +
      cur.cards.reduce((acc2: number, card: Card) => {
        return acc2 + card.value;
      }, 0) +
      cur.possibleTradeCards.reduce((acc3: number, card2: Card) => {
        return acc3 + card2.value;
      }, 0)
    );
  }, 0);

  if (sum !== 676) throw new Error("The game state is not possible");
};

export const startGame = (table: Table): void => {
  table.currentTrick = [];
  table.currentPlayerTurn = getTheGreaterDalmuti(table);
};

export const makeMove = (
  table: Table,
  playerId: string,
  move: Card[]
): void => {
  const player: Player | undefined = table.players.find(
    (P: Player) => P.socketId === playerId
  );

  if (playerId !== table.currentPlayerTurn?.socketId)
    throw new Error("Not your turn");

  if (!player) throw new Error("Player not at table");

  if (!isAllJokers(move) && cardsAllMatch(move) && hasCards(player, move)) {
    if (table.currentTrick.length !== 0) {
      const mostRecentTrick = table.currentTrick[table.currentTrick.length - 1];

      if (move.length !== mostRecentTrick.length)
        throw new Error(
          "Cant play a move with a different amount of cards than the last trick"
        );

      const valueOfLastTrick = getFirstNonJokerCard(mostRecentTrick).value;
      const valueOfProposedMove = getFirstNonJokerCard(move).value;

      if (valueOfProposedMove !== valueOfLastTrick)
        throw new Error("Cant play ");
    }

    // Play the move
    table.currentTrick.push(move);
    // Remove the cards from the players hand
    move.forEach((C: Card) => {
      const indexOfCard = player.cards.findIndex(
        (cardInHand: Card) => cardInHand.value === C.value
      );
      player.cards.splice(indexOfCard, 1);
    });
  } else {
    throw new Error("Invalid move");
  }
};

export const isPlayerOutOfCards = (table: Table, playerId: string): boolean => {
  const player = getPlayer(table, playerId);

  return player.cards.length === 0;
};

export const movePlayerForNextRound = (table: Table, playerId: string) => {
  const seatNumber: number = getPlayerSeatId(table, playerId);

  table.playerSeatsNextRound.push(table.players[seatNumber]);

  table.players.splice(seatNumber, 1);
};

export const goToNextPlayersTurn = (table: Table): void => {
  if (!table.currentPlayerTurn) {
    table.currentPlayerTurn = table.players[0];
  } else {
    const currentPlayerSeatNumber = getPlayerSeatId(
      table,
      table.currentPlayerTurn.socketId
    );

    let nextPlayersSeatNumber: number;

    if (currentPlayerSeatNumber + 1 > table.players.length - 1) {
      nextPlayersSeatNumber = 0;
    } else {
      nextPlayersSeatNumber = currentPlayerSeatNumber + 1;
    }

    table.currentPlayerTurn = table.players[nextPlayersSeatNumber];
  }
};

export const addPlayerToTable = (
  table: Table,
  playerName: string,
  playerId: string
): void => {
  if (table.players.length === 8) throw new Error("Table full");

  if (
    table.players.find(
      (P: Player) => P.name === playerName || P.socketId === playerId
    ) !== undefined
  ) {
    throw new Error("Player already at table");
  }
  table.players.push(getDefaultPlayer(playerName, playerId));
};
