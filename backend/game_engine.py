import copy
from typing import Dict, Union
from data import GameJoinInput, GameStartInput, GameState, Player, PlayerMoveInput


WINNING_MOVES = [
    ["1-1", "1-2", "1-3"],
    ["1-1", "2-1", "3-1"],
    ["1-1", "2-2", "3-3"],
    ["1-3", "2-2", "3-1"],
    ["1-3", "2-3", "3-3"],
    ["2-1", "2-2", "2-3"],
    ["3-1", "3-2", "3-3"],
    ["1-2", "2-2", "3-2"],
]


def we_have_a_winner(game_state: GameState) -> Union[Player, None]:
    current_player_type = game_state.player_active.player_type
    current_player_moves = [
        cell
        for (cell, player_type) in game_state.board.items()
        if (player_type == current_player_type)
    ]
    for winning_move in WINNING_MOVES:
        if all(winning_cell in current_player_moves for winning_cell in winning_move):
            return game_state.player_active
    return "draw" if game_state.move_count == 9 else None


def move(game_state: GameState, player_input: PlayerMoveInput) -> GameState:
    new_game_state = game_state.model_copy()
    new_board = new_game_state.board
    if new_board.get(player_input.cell) is not None:
        raise Exception("Cell already taken")
    new_board[player_input.cell] = player_input.currentPlayer.player_type
    new_game_state.move_count += 1
    have_winner = we_have_a_winner(new_game_state)
    if have_winner:
        new_game_state.result = "draw" if have_winner == "draw" else player_input.currentPlayer
    else:
        new_game_state.player_active = (
            game_state.player_joined
            if (
                player_input.currentPlayer.player_type
                == game_state.player_owner.player_type
            )
            else game_state.player_owner
        )
    return new_game_state


def pick_starting_player(game_state: GameState) -> Player:
    timestamp = game_state.created_at
    return game_state.player_owner if timestamp % 2 == 0 else game_state.player_joined


def player_joined_game(game_state: GameState, game_join: GameJoinInput) -> GameState:
    new_game_state = game_state.model_copy()
    new_game_state.player_joined = game_join.player_joined
    new_game_state.player_active = pick_starting_player(new_game_state)
    return new_game_state


def create_new_game(game_input: GameStartInput):
    game_state = GameState(
        title=game_input.title,
        created_at=game_input.timestamp,
        board=dict(**{
            '1-1': None,
            '1-2': None,
            '1-3': None,
            '2-1': None,
            '2-2': None,
            '2-3': None,
            '3-1': None,
            '3-2': None,
            '3-3': None,
        }),
        result=None,
        player_owner=game_input.player_owner,
        player_joined=None,
        player_active=None,
        move_count=0,
    )
    return game_state
