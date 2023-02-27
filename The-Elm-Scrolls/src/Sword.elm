module Sword exposing (..)

import Game.TwoD.Render as Render exposing (..)
import Game.Resources as Resources exposing (..)
import Keyboard


type alias Sword =
  { x : Float
  , y : Float
  , width : Float
  , height : Float
  , action : Action
  , swordType : SwordType
  , attack : Int
  }

type Action
  = NotAttack
  | Attack

type SwordType
  = Wood
  | Stone
  | Iron
  | Dragon

textures : List String
textures =
  [ "assets/sword/sword_wood.png"
  , "assets/sword/sword_wood_attack.png"
  , "assets/sword/sword_stone.png"
  , "assets/sword/sword_stone_attack.png"
  , "assets/sword/sword_iron.png"
  , "assets/sword/sword_iron_attack.png"
  , "assets/sword/sword_dragon.png"
  , "assets/sword/sword_dragon_attack.png"
  ]

swordTypeToString : Sword -> String
swordTypeToString sword =
  case sword.swordType of
    Wood ->
      "wood"

    Stone ->
      "stone"

    Iron ->
      "iron"

    Dragon ->
      "dragon"

updateSwordCoordinates : Sword -> Float -> Float -> Sword
updateSwordCoordinates sword playerX playerY =
  { sword
    | x = playerX + 0.75
    , y = playerY + 0.5
  }

swordAttack : List Keyboard.Key -> Sword -> Sword
swordAttack keys sword =
  { sword
    | action =
        if List.member Keyboard.Spacebar keys then
          Attack
        else
          NotAttack
  }

woodSword : Sword
woodSword =
  { x = 0
  , y = 0
  , width = 1
  , height = 0.5
  , action = NotAttack
  , swordType = Wood
  , attack = 5
  }

stoneSword : Sword
stoneSword =
  { x = 0
  , y = 0
  , width = 1
  , height = 0.5
  , action = NotAttack
  , swordType = Stone
  , attack = 5
  }

ironSword : Sword
ironSword =
  { x = 0
  , y = 0
  , width = 1
  , height = 0.5
  , action = NotAttack
  , swordType = Iron
  , attack = 5
  }

dragonSword : Sword
dragonSword =
  { x = 0
  , y = 0
  , width = 1
  , height = 0.5
  , action = NotAttack
  , swordType = Dragon
  , attack = 5
  }

renderSwordIdle : Resources -> Sword -> Renderable
renderSwordIdle resources sword =
  Render.spriteWithOptions
    { texture = Resources.getTexture ("assets/sword/sword_" ++ swordTypeToString sword ++ ".png") resources
    , position = ( sword.x, sword.y, 0.1 )
    , size = ( 0.5, 1 )
    , tiling = ( 1, 1 )
    , rotation = 0 -- -1
    , pivot = ( 0, 0)
    }

renderSwordAttack : Resources -> Sword -> Renderable
renderSwordAttack resources sword =
  Render.spriteWithOptions
    { texture = Resources.getTexture ("assets/sword/sword_" ++ swordTypeToString sword ++ "_attack.png") resources
    , position = ( sword.x, sword.y, 0.1 )
    , size = ( 1, 0.5 )
    , tiling = ( 1, 1 )
    , rotation = 0 -- -1
    , pivot = ( 0, 0)
    }
