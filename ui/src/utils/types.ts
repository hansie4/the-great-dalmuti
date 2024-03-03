export interface ChatMessage {
  message: string;
  timestamp: number;
  sender: string;
}

export enum Stage {
  WAITING_ON_PLAYERS,
  DREW_ORDER,
  TAXATION,
  ROUND,
  ROUND_END
}

export interface GameState {
  stage: string;
  table: Table;
}

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
  score: number;
  cards: number;
  startingOrderCard: Card | null;
  ready: boolean;
}

export interface Card {
  title: string;
  value: number;
}
