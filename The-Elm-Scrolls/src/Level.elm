module Level exposing (..)

import Player exposing (..)
import Enemy exposing (..)

type alias Level =
  { level_environment : Level_Environment
  , player : Player
  , enemies : List Enemy
  }

type Level_Environment
  = Forest
  | Castle
  | Dungeon
