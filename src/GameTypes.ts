export interface Table {
  players: Player[];
  playedCards: Card[];
  currentTrick: Card[];
}

export interface Player {
  name: string;
  score: number;
  cards: Card[];
}

export interface Card {
  value: number;
}
