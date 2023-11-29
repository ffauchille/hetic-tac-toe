from datetime import datetime
import pytest

from data import GameJoinInput, GameState, Player, PlayerMoveInput
from game_engine import player_joined_game, we_have_a_winner, move
player_owner = Player(player_name="Player Owner", player_type="X")
player_joined = Player(player_name="Player Joined", player_type="O")
created_at = round(datetime.now().timestamp() * 1000)
pair_created_at = 1614556800000

before_join_game = GameState(
    title="Test game",
    created_at = pair_created_at,
    board = dict(),
    result = None,
    player_owner = player_owner,
    player_joined = None,
    player_active = None,
    move_count = 0
)

after_join_game = GameState(
    title="Test game",
    created_at = pair_created_at,
    board = dict(),
    result = None,
    player_owner = player_owner,
    player_joined = player_joined,
    player_active = player_owner,
    move_count = 0
)

player_owner_wins = GameState(
    title="No winners" ,
    created_at = created_at,
    board = dict({
        "1-1": "X",
        "2-1": "O",
        "1-2": "X",
        "2-2": "O",
        "1-3": "X"
    }),
    result = None,
    player_owner = player_owner,
    player_joined = player_joined,
    player_active = player_owner,
    move_count = 5
)

player_joined_wins = GameState(
    title="No winners" ,
    created_at = created_at,
    board = dict({
        "1-1": "X",
        "2-1": "O",
        "1-2": "X",
        "2-2": "O",
        "3-1": "X",
        "2-3": "O"
    }),
    result = None,
    player_owner = player_owner,
    player_joined = player_joined,
    player_active = player_joined,
    move_count = 6
)

before_first_move = GameState(
    title="Test game",
    created_at = created_at,
    board = dict(),
    result = None,
    player_owner = player_owner,
    player_joined = player_joined,
    player_active = player_owner,
    move_count = 0
)

first_move = PlayerMoveInput(
    cell="1-1",
    currentPlayer=player_owner,
    game_id="game_test_id"
)

after_first_move = GameState(
    title="Test game",
    created_at = created_at,
    board = dict({ "1-1": "X" }),
    result = None,
    player_owner = player_owner,
    player_joined = player_joined,
    player_active = player_joined,
    move_count = 1
)

second_move = PlayerMoveInput(
    cell="2-1",
    currentPlayer=player_joined,
    game_id="game_test_id"
)
after_second_move = GameState(
    title="Test game" ,
    created_at = created_at,
    board = dict({
        "1-1": "X",
        "2-1": "O",
    }),
    result = None,
    player_owner = player_owner,
    player_joined = player_joined,
    player_active = player_owner,
    move_count = 2
)

third_move = PlayerMoveInput(
    cell="1-2",
    currentPlayer=player_owner,
    game_id="game_test_id"
)
after_third_move = GameState(
    title="Test game" ,
    created_at = created_at,
    board = dict({
        "1-1": "X",
        "2-1": "O",
        "1-2": "X",
    }),
    result = None,
    player_owner = player_owner,
    player_joined = player_joined,
    player_active = player_joined,
    move_count = 3
)

move_4 = PlayerMoveInput(
    cell="2-2",
    currentPlayer=player_joined,
    game_id="game_test_id"
)
after_move_4 = GameState(
    title="Test game" ,
    created_at = created_at,
    board = dict({
        "1-1": "X",
        "2-1": "O",
        "1-2": "X",
        "2-2": "O",
    }),
    result = None,
    player_owner = player_owner,
    player_joined = player_joined,
    player_active = player_owner,
    move_count = 4
)

move_5 = PlayerMoveInput(
    cell="1-3",
    currentPlayer=player_owner,
    game_id="game_test_id"
)
after_move_5 = GameState(
    title="Test game" ,
    created_at = created_at,
    board = dict({
        "1-1": "X",
        "2-1": "O",
        "1-2": "X",
        "2-2": "O",
        "1-3": "X",
    }),
    result = player_owner,
    player_owner = player_owner,
    player_joined = player_joined,
    player_active = player_owner,
    move_count = 5
)

after_last_possible_move = GameState(
    title="Test game" ,
    created_at = created_at,
    board = dict({
        "1-1": "O",
        "1-2": "X",
        "3-1": "O",
        "2-1": "X",
        "2-2": "O",
        "3-3": "X",
        "2-3": "O",
        "1-3": "X",
        "3-2": "O",
    }),
    result = "draw",
    player_owner = player_owner,
    player_joined = player_joined,
    player_active = player_owner,
    move_count = 9
)



@pytest.mark.parametrize("game_state, player_move, game_state_after_move", [
    (before_first_move, first_move, after_first_move),
    (after_first_move, second_move, after_second_move),
    (after_second_move, third_move, after_third_move),
    (after_third_move, move_4, after_move_4),
    (after_move_4, move_5, after_move_5)
])
def test_move(game_state, player_move, game_state_after_move):
    move_result = move(game_state, player_move)
    assert move_result == game_state_after_move

def test_move_cell_already_taken():
    with pytest.raises(Exception):
        move(after_move_4, move_4)

@pytest.mark.parametrize("game_state, expected", [
    (before_first_move, None),
    (player_owner_wins, player_owner),
    (player_joined_wins, player_joined),
    (after_last_possible_move, "draw")
])
def test_we_have_a_winner(game_state, expected):
    have_winner = we_have_a_winner(game_state)
    assert have_winner == expected

def test_player_joined():
    new_game_state = player_joined_game(before_join_game, GameJoinInput(
        game_id="game_test_id",
        player_joined=player_joined
    ))
    assert new_game_state == after_join_game