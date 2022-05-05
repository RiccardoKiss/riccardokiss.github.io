module Sword exposing (..)

import Game.TwoD.Render as Render exposing (..)
import Game.Resources as Resources exposing (..)


type alias Sword =
  { x : Float
  , y : Float
  , width : Float
  , height : Float
  , action : Action
  , sword_type : Sword_Type
  , attack : Int
  }

type Action
  = NotAttack
  | Attack

type Sword_Type
  = Wood
  | Stone
  | Iron
  | Dark

textures : List String
textures =
  [ "assets/sword_wood.png"
  , "assets/sword_wood_attack.png"
  , "assets/sword_stone.png"
  , "assets/sword_stone_attack.png"
  , "assets/sword_iron.png"
  , "assets/sword_iron_attack.png"
  , "assets/sword_dark.png"
  , "assets/sword_dark_attack.png"
  ]

swordTypeToString : Sword -> String
swordTypeToString sword =
  case sword.sword_type of
    Wood ->
      "wood"

    Stone ->
      "stone"

    Iron ->
      "iron"

    Dark ->
      "dark"

updateSwordCoordinates : Sword -> Float -> Float -> Sword
updateSwordCoordinates sword playerX playerY =
  { sword
    | x = playerX + 0.75
    , y = playerY + 0.5
  }

renderSwordIdle : Resources -> Sword -> Renderable
renderSwordIdle resources sword =
  Render.spriteWithOptions
    { texture = Resources.getTexture ("assets/sword_" ++ swordTypeToString sword ++ ".png") resources
    , position = ( sword.x, sword.y, 0.1 )
    , size = ( 0.5, 1 )
    , tiling = ( 1, 1 )
    , rotation = 0 -- -1
    , pivot = ( 0, 0)
    }

renderSwordAttack : Resources -> Sword -> Renderable
renderSwordAttack resources sword =
  Render.spriteWithOptions
    { texture = Resources.getTexture ("assets/sword_" ++ swordTypeToString sword ++ "_attack.png") resources
    , position = ( sword.x, sword.y, 0.1 )
    , size = ( 1, 0.5 )
    , tiling = ( 1, 1 )
    , rotation = 0 -- -1
    , pivot = ( 0, 0)
    }
