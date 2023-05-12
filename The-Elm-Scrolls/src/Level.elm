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

textures : List String
textures =
  [ "assets/level/level_1.png"
  , "assets/level/level_2.png"
  --, "assets/level/level_3.png"
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

level1Enemies : List Enemy
level1Enemies =
  [ skeleton 57 17 Enemy.Right
  --, skeleton 55 12 Enemy.Up
  --, skeleton 55 14 Enemy.Up
  ]

level1Items : List Item
level1Items =
  [ healthPotionStand 53 9
  --, healthPotionStand 54 9
  --, speedPotionStand 57 9
  , speedPotionStand 58 9
  --, stoneSwordStand 53 11
  --, ironSwordStand 53 13
  --, dragonSwordStand 53 15
  --, leatherArmorStand 58 11
  --, silverArmorStand 58 13
  --, dragonArmorStand 58 15
  , stoneSwordStand 46 72
  , leatherArmorStand 110 17
  , speedPotionStand 108 16
  , speedPotionStand 112 16
  ]

level1 : Level
level1 =
  { map = Lvl1
  , mapTexture = "assets/level/level_1.png"
  , enemies = level1Enemies
  , items = level1Items
  , startX = 55.5
  , startY = 9.0
  , endX = 81.0
  , endY = 79.0
  }

level2Enemies : List Enemy
level2Enemies =
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

level2 : Level
level2 =
  { map = Lvl2
  , mapTexture = "assets/level/level_2.png"
  , enemies = level2Enemies
  , items = level2Items
  , startX = 47.0
  , startY = 18.0
  , endX = 106.0
  , endY = 59.0
  }
