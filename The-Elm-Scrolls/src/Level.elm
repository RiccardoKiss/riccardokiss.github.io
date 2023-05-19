module Level exposing (..)

import Enemy exposing (..)
import Item exposing (..)


type alias Level =
  { map : Map
  , mapTexture : String
  , enemies : List Enemy  -- spawn positions for each enemy
  , items : List Item     -- spawn positions for each item
  , startX : Float
  , startY : Float
  , endX : Float
  , endY : Float
  }

type Map
  = Lvl1
  | Lvl2
  | Lvl3

type Difficulty
  = Easy
  | Medium
  | Hard

textures : List String
textures =
  [ "assets/level/level_1.png"
  , "assets/level/level_2.png"
  , "assets/level/level_3.png"
  ]

mapToString : Level -> String
mapToString level =
  case level.map of
    Lvl1 ->
      "LvL1"

    Lvl2 ->
      "LvL2"

    Lvl3 ->
      "LvL3"

applyDifficultyToEnemy : Difficulty -> Enemy -> Enemy
applyDifficultyToEnemy difficulty enemy =
  case difficulty of
    Easy ->
      { enemy
        | health = enemy.health * 1
      }

    Medium ->
      { enemy
        | health = enemy.health * 2
      }

    Hard ->
      { enemy
        | health = enemy.health * 3
      }

level1Enemies : Difficulty -> List Enemy
level1Enemies difficulty =
  let
    enemies =
      [ skeleton 57 17 Enemy.Right
      --, skeleton 55 12 Enemy.Up
      --, skeleton 55 14 Enemy.Up
      ]
  in
  enemies
  |> List.map (applyDifficultyToEnemy difficulty)

level1Items : List Item
level1Items =
  [ healthPotionStand 53 9
  , speedPotionStand 58 9
  , healthPotionStand 74 12
  , speedPotionStand 78 12
  , healthPotionStand 27 37
  , speedPotionStand 31 37
  , healthPotionStand 23 53
  , speedPotionStand 23 49
  , healthPotionStand 90 53
  , speedPotionStand 90 49
  , healthPotionStand 100 44
  , speedPotionStand 104 44
  , stoneSwordStand 46 72
  , healthPotionStand 44 73
  , speedPotionStand 48 73
  , leatherArmorStand 110 17
  , healthPotionStand 108 16
  , speedPotionStand 112 16
  ]

level1StartCoordinates : { x : Float, y : Float }
level1StartCoordinates =
  { x = 55.5
  , y = 9.0
  }

level1 : Difficulty -> Level
level1 difficulty =
  { map = Lvl1
  , mapTexture = "assets/level/level_1.png"
  , enemies = level1Enemies difficulty
  , items = level1Items
  , startX = level1StartCoordinates.x
  , startY = level1StartCoordinates.y
  , endX = 81.0
  , endY = 79.0
  }

level2Enemies : Difficulty -> List Enemy
level2Enemies difficulty =
  []

level2Items : List Item
level2Items =
  [ speedPotionStand 16 28
  , healthPotionStand 16 9
  , speedPotionStand 35 9
  , healthPotionStand 35 28
  , ironSwordStand 53 70
  , healthPotionStand 48 76
  , speedPotionStand 48 65
  , speedPotionStand 59 76
  , healthPotionStand 59 65
  , silverArmorStand 106 78
  , speedPotionStand 107 80
  , healthPotionStand 76 13
  , speedPotionStand 79 13
  , healthPotionStand 80 57
  , speedPotionStand 80 60
  , healthPotionStand 68 97
  , speedPotionStand 71 97
  , healthPotionStand 107 116
  , speedPotionStand 107 113
  ]

level2StartCoordinates : { x : Float, y : Float }
level2StartCoordinates =
  { x = 47.0
  , y = 18.0
  }

level2 : Difficulty -> Level
level2 difficulty =
  { map = Lvl2
  , mapTexture = "assets/level/level_2.png"
  , enemies = level2Enemies difficulty
  , items = level2Items
  , startX = level2StartCoordinates.x
  , startY = level2StartCoordinates.y
  , endX = 106.0
  , endY = 59.0
  }

level3Enemies : Difficulty -> List Enemy
level3Enemies difficulty =
  []

level3Items : List Item
level3Items =
  [ speedPotionStand 74 29
  , healthPotionStand 77 29
  , speedPotionStand 34 46
  , healthPotionStand 37 46
  , speedPotionStand 22 65
  , healthPotionStand 22 62
  , speedPotionStand 45 81
  , healthPotionStand 45 78
  , speedPotionStand 81 93
  , healthPotionStand 81 90
  , speedPotionStand 101 81
  , healthPotionStand 101 78
  , speedPotionStand 101 49
  , healthPotionStand 101 46
  , speedPotionStand 26 113
  , healthPotionStand 26 110
  , dragonArmorStand 28 111
  , speedPotionStand 102 98
  , healthPotionStand 105 98
  , dragonSwordStand 104 100
  ]

level3StartCoordinates : { x : Float, y : Float }
level3StartCoordinates =
  { x = 63.5
  , y = 63.5
  }

level3 : Difficulty -> Level
level3 difficulty =
  { map = Lvl3
  , mapTexture = "assets/level/level_3.png"
  , enemies = level3Enemies difficulty
  , items = level3Items
  , startX = level3StartCoordinates.x
  , startY = level3StartCoordinates.y
  , endX = 109.0
  , endY = 31.0
  }
