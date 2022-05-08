module Level exposing (..)

--import Enemy exposing (..)

{-
type alias Level =
  { level_environment : Level_Environment
  , enemies : List Enemy -- spawn positions for each enemy
  , startX : Float
  , startY : Float
  , endX : Float
  , endY : Float
  }

type Level_Environment
  = Forest
  | Castle
  | Dungeon
-}

type Level
  = Lvl1
  | Lvl2
  | Lvl3

textures : List String
textures =
  [ "assets/level/level_2.png"
  --, "assets/level/level_1.png"
  --, "assets/level/level_3.png"
  ]
