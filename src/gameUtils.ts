import { Game, Player, PublicPlayer, Stage } from "./GameTypes";

export const getDefaultGame = (): Game => {
  return {
    table: {
      players: [],
      playerSeatsNextRound: [],
      currentTrick: [],
      greaterRevolutionWasCalled: false,
      revolutionWasCalled: false,
      currentPlayerTurn: null
    },
    stage: Stage.WAITING_ON_PLAYERS
  };
};

export const getDefaultPlayer = (
  playerName: string,
  playerId: string
): Player => {
  return {
    name: playerName,
    socketId: playerId,
    score: 0,
    cards: [],
    possibleTradeCards: [],
    startingOrderCard: null,
    ready: false
  };
};

export const mapPlayersToPublicPlayers = (
  players: Player[]
): PublicPlayer[] => {
  return players.map((P: Player) => {
    return {
      name: P.name,
      score: P.score,
      cards: P.cards.length
    };
  });
};