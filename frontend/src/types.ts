export type GameState = {
  title: string;
  board: TicTacToBoard;
  result: Player | null | 'draw';
  created_at: number;
  move_count: number;
  player_owner: Player;
  player_joined: Player | null;
  player_active: Player | null;
}

export type GameSetupState = {
  game_state?: GameState;
  game_id?: string;
  joining?: boolean;
  starting?: boolean;
  whoami?: PlayerSetup;
  savingMove?: boolean; 
}

export type PlayerSetup = 'owner' | 'joiner';
export type PlayerType = 'O' | 'X';

export type Player = {
  player_name: string;
  player_type: PlayerType;
}

export type TicTacToeCell =
  | '1-1'
  | '1-2'
  | '1-3'
  | '2-1'
  | '2-2'
  | '2-3'
  | '3-1'
  | '3-2'
  | '3-3'

export type CellFilling = PlayerType | 'empty';

export type TicTacToBoard = {
  [c in TicTacToeCell]: CellFilling
}

export type GameEngineResponse = {
  game_id: string;
  game_state: GameState;
}

export type GameErrorResponse = {
  error: string;
}