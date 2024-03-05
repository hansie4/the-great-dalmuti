export enum GameRole {
  THE_GREATER_DALMUTI = 0,
  THE_LESSER_DALMUTI = 1,
  MERCHANT = 2,
  THE_LESSER_PEON = 3,
  THE_GREATER_PEON = 4
}

export const getRole = (playerIndex: number, numPlayers: number): GameRole => {
  if (playerIndex === 0) return GameRole.THE_GREATER_DALMUTI;
  if (playerIndex === 1) return GameRole.THE_LESSER_DALMUTI;
  if (playerIndex === numPlayers - 1) return GameRole.THE_GREATER_PEON;
  if (playerIndex === numPlayers - 2) return GameRole.THE_LESSER_PEON;
  return GameRole.MERCHANT;
};
