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
  --, endX : Float
  --, endY : Float
  }

type Map
  = Lvl1
  | Lvl2
  | Lvl3

textures : List String
textures =
  [ "assets/level/level_2_updated.png"
  --, "assets/level/level_1.png"
  --, "assets/level/level_3.png"
  ]

level2Enemies : List Enemy
level2Enemies =
  [ --prototype 57 17 Enemy.Right
  --, skeleton 55 12 Enemy.Up
  --, skeleton 55 14 Enemy.Up
  ]

level2Items : List Item
level2Items =
  [ healthPotionStand 57 11
  , speedPotionStand 55 12
  , stoneSwordStand 55 15
  , dragonArmorStand 57 16
  ]

level2 : Level
level2 =
  { map = Lvl2
  , mapTexture = "assets/level/level_2_updated.png"
  , enemies = level2Enemies
  , items = level2Items
  , startX = 56.0
  , startY = 9.0
  --, endX = 81.0
  --, endY = 73.0
  }
