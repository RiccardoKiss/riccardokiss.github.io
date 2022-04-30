module Enemy exposing (..)

import Game.TwoD.Render as Render exposing (..)
import Game.Resources as Resources exposing (..)


type alias Enemy =
  { x : Float
  , y : Float
  , vx : Float
  , vy : Float
  , dir : Direction
  , enemy_type : Enemy_Type
  --, health : Int
  --, attack : Int
  --, defense : Int
  , speed : Float
  --, exp_drop : Int
  --, detect_player_radius : Float
  --, alive : Bool
  }

type Direction
  = Left
  | Right
  | Up
  | Down
  --| Idle

type Enemy_Type
  = Bandit
  | Zombie
  | Skeleton
  | Prototype

textures : List String
textures =
  [ "assets/enemy/enemyRight.png"
  , "assets/enemy/enemyLeft.png"
  , "assets/enemy/enemyUp.png"
  , "assets/enemy/enemyDown.png"
  --, "assets/enemy/enemyIdle.png"
  ]

enemyTypeToString : Enemy -> String
enemyTypeToString enemy =
  case enemy.enemy_type of
    Bandit ->
      "bandit"

    Zombie ->
      "zombie"

    Skeleton ->
      "skeleton"

    Prototype ->
      "enemy"

enemyMovement : Enemy -> Enemy -> Float -> Enemy
enemyMovement initEnemy enemy distance =
  case initEnemy.dir of
    Left ->
      if (toFloat (floor enemy.x)) == (initEnemy.x - distance) then
        { enemy
          | dir = Right
          , vx = enemy.speed
        }
      else if (toFloat (floor enemy.x)) == initEnemy.x then
        { enemy
          | dir = Left
          , vx = -1 * enemy.speed
        }
      else enemy

    Right ->
      if (toFloat (floor enemy.x)) == (initEnemy.x + distance) then
        { enemy
          | dir = Left
          , vx = -1 * enemy.speed
        }
      else if (toFloat (floor enemy.x)) == initEnemy.x then
        { enemy
          | dir = Right
          , vx = enemy.speed
        }
      else enemy

    Up ->
      if (toFloat (floor enemy.y)) == (initEnemy.y + distance) then
        { enemy
          | dir = Down
          , vy = -1 * enemy.speed
        }
      else if (toFloat (floor enemy.y)) == initEnemy.y then
        { enemy
          | dir = Up
          , vy = enemy.speed
        }
      else enemy

    Down ->
      if (toFloat (floor enemy.y)) == (initEnemy.y - distance) then
        { enemy
          | dir = Up
          , vy = enemy.speed
        }
      else if (toFloat (floor enemy.y)) == initEnemy.y then
        { enemy
          | dir = Down
          , vy = -1 * enemy.speed
        }
      else enemy

renderEnemy : Resources -> Enemy -> Renderable
renderEnemy resources enemy =
  Render.animatedSpriteWithOptions
    { position = ( enemy.x, enemy.y, -0.1 )
    , size = ( 1, 2 )
    , texture =
        case enemy.dir of
          Left ->
            Resources.getTexture ("assets/enemy/" ++ enemyTypeToString enemy ++ "Left.png") resources

          Right ->
            Resources.getTexture ("assets/enemy/" ++ enemyTypeToString enemy ++ "Right.png") resources

          Up ->
            Resources.getTexture ("assets/enemy/" ++ enemyTypeToString enemy ++ "Up.png") resources

          Down ->
            Resources.getTexture ("assets/enemy/" ++ enemyTypeToString enemy ++ "Down.png") resources
    , bottomLeft = ( 0, 0 )
    , topRight = ( 1, 1 )
    , duration = 1
    , numberOfFrames = 2
    , rotation = 0
    , pivot = ( 0, 0 )
    }
