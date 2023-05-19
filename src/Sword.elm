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
  , dir : Direction
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

type Direction
  = Left
  | Right
  | Up
  | Down
  | Idle

textures : List String
textures =
  [ "assets/sword/sword_wood.png"
  , "assets/sword/sword_wood_attack_right.png"
  , "assets/sword/sword_wood_attack_left.png"
  , "assets/sword/sword_wood_attack_up.png"
  , "assets/sword/sword_wood_attack_down.png"
  , "assets/sword/sword_stone.png"
  , "assets/sword/sword_stone_attack_right.png"
  , "assets/sword/sword_stone_attack_left.png"
  , "assets/sword/sword_stone_attack_up.png"
  , "assets/sword/sword_stone_attack_down.png"
  , "assets/sword/sword_iron.png"
  , "assets/sword/sword_iron_attack_right.png"
  , "assets/sword/sword_iron_attack_left.png"
  , "assets/sword/sword_iron_attack_up.png"
  , "assets/sword/sword_iron_attack_down.png"
  , "assets/sword/sword_dragon.png"
  , "assets/sword/sword_dragon_attack_right.png"
  , "assets/sword/sword_dragon_attack_left.png"
  , "assets/sword/sword_dragon_attack_up.png"
  , "assets/sword/sword_dragon_attack_down.png"
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

swordDirectionToString : Sword -> String
swordDirectionToString sword =
  case sword.dir of
    Left ->
      "left"

    Right ->
      "right"

    Up ->
      "up"

    Down ->
      "down"

    Idle ->
      "left"

updateSwordCoordinates : Direction -> Float -> Float -> Sword -> Sword
updateSwordCoordinates playerDir playerX playerY sword =
  case playerDir of
    Left ->
      { sword
        | x =
            case sword.action of
              NotAttack ->
                playerX + 0.15

              Attack ->
                playerX - 0.7

        , y =
            case sword.action of
              NotAttack ->
                playerY + 0.7

              Attack ->
                playerY + 0.6

        , dir = playerDir
      }

    Right ->
      { sword
        | x =
            case sword.action of
              NotAttack ->
                playerX + 0.4

              Attack ->
                playerX + 0.3

        , y =
            case sword.action of
              NotAttack ->
                playerY + 0.5

              Attack ->
                playerY + 0.4

        , dir = playerDir
      }

    Up ->
      { sword
        | x =
            case sword.action of
              NotAttack ->
                playerX + 0.75

              Attack ->
                playerX + 0.65

        , y =
            case sword.action of
              NotAttack ->
                playerY + 0.6

              Attack ->
                playerY + 1.2

        , dir = playerDir
      }

    Down ->
      { sword
        | x =
            case sword.action of
              NotAttack ->
                playerX + 0.2

              Attack ->
                playerX

        , y =
            case sword.action of
              NotAttack ->
                playerY + 0.5

              Attack ->
                playerY - 0.2

        , dir = playerDir
      }

    Idle ->
      { sword
        | x =
            case sword.action of
              NotAttack ->
                playerX + 0.1

              Attack ->
                playerX - 0.7

        , y =
            case sword.action of
              NotAttack ->
                playerY + 0.5

              Attack ->
                playerY + 0.5

        , dir = playerDir
      }

swordAttack : Sword -> List Keyboard.Key -> Sword
swordAttack sword keys =
  if List.member Keyboard.Spacebar keys then
    { sword
      | action = Attack
      , width =
          if sword.dir == Up || sword.dir == Down then
            0.5
          else
            1.0
      , height =
          if sword.dir == Up || sword.dir == Down then
            1.0
          else
            0.5
    }
  else
    { sword
      | action = NotAttack
      , width = 0.5
      , height = 1.0
    }

woodSword : Sword
woodSword =
  { x = 0
  , y = 0
  , width = 0.5
  , height = 1.0
  , action = NotAttack
  , swordType = Wood
  , dir = Idle
  , attack = 5
  }

stoneSword : Sword
stoneSword =
  { x = 0
  , y = 0
  , width = 0.5
  , height = 1.0
  , action = NotAttack
  , swordType = Stone
  , dir = Idle
  , attack = 10
  }

ironSword : Sword
ironSword =
  { x = 0
  , y = 0
  , width = 0.5
  , height = 1.0
  , action = NotAttack
  , swordType = Iron
  , dir = Idle
  , attack = 15
  }

dragonSword : Sword
dragonSword =
  { x = 0
  , y = 0
  , width = 0.5
  , height = 1.0
  , action = NotAttack
  , swordType = Dragon
  , dir = Idle
  , attack = 20
  }

renderSword : Resources -> Sword -> Renderable
renderSword resources sword =
  let
    swordImgPath =
      case sword.action of
        NotAttack ->
          "assets/sword/sword_" ++ swordTypeToString sword ++ ".png"

        Attack ->
          "assets/sword/sword_" ++ swordTypeToString sword ++ "_attack_" ++ swordDirectionToString sword ++ ".png"
  in
  Render.spriteWithOptions
    { texture = Resources.getTexture swordImgPath resources
    , position = ( sword.x, sword.y, 0.1 )
    , size = ( sword.width, sword.height )
    , tiling = ( 1, 1 )
    , rotation = 0 -- -1
    , pivot = ( 0, 0)
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
    { texture = Resources.getTexture ("assets/sword/sword_" ++ swordTypeToString sword ++ "_attack_" ++ swordDirectionToString sword ++ ".png") resources
    , position = ( sword.x, sword.y, 0.1 )
    , size =
        if sword.dir == Up || sword.dir == Down  then
          ( 0.5, 1 )
        else
          ( 1, 0.5 )
    , tiling = ( 1, 1 )
    , rotation = 0 -- -1
    , pivot = ( 0, 0)
    }
