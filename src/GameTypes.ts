export interface Table {
  players: Player[];
  playerSeatsNextRound: Player[];
  currentTrick: Card[][];
  greaterRevolutionWasCalled: boolean;
  revolutionWasCalled: boolean;
  currentPlayerTurn: Player | null;
}

export interface Player {
  name: string;
  socketId: string;
  score: number;
  cards: Card[];
  possibleTradeCards: Card[];
  startingOrderCard: Card | null;
  ready: boolean;
}

export interface Card {
  title: string;
  value: number;
}

export enum Stage {
  WAITING_ON_PLAYERS,
  DREW_ORDER,
  TAXATION,
  ROUND,
  ROUND_END
}

export interface Game {
  table: Table;
  stage: Stage;
}

export interface PublicPlayer {
  name: string;
  score: number;
  cards: number;
  playerIdHash: string;
}
