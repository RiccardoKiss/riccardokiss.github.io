module Enemy exposing (..)

import Game.TwoD.Render as Render exposing (..)
import Game.Resources as Resources exposing (..)


type alias Enemy =
  { initX : Float
  , initY : Float
  , initDir : Direction
  , x : Float
  , y : Float
  , vx : Float
  , vy : Float
  , dir : Direction
  , width : Float
  , height : Float
  , enemyType : EnemyType
  , speed : Float
  , attack : Int
  , health : Int
  --, defense : Int
  , expDrop : Int
  --, detect_player_radius : Float
  , alive : Bool
  }

type Direction
  = Left
  | Right
  | Up
  | Down
  --| Idle

type EnemyType
  = Bandit
  | Zombie
  | Skeleton
  | Prototype

textures : List String
textures =
  [ "assets/enemy/enemy_right.png"
  , "assets/enemy/enemy_left.png"
  , "assets/enemy/enemy_up.png"
  , "assets/enemy/enemy_down.png"
  --, "assets/enemy/enemy_idle.png"
  ]

isAlive : Enemy -> Bool
isAlive enemy =
  if enemy.alive then True else False

getAttack : Enemy -> Int
getAttack enemy =
    enemy.attack

enemyTypeToString : Enemy -> String
enemyTypeToString enemy =
  case enemy.enemyType of
    Bandit ->
      "bandit"

    Zombie ->
      "zombie"

    Skeleton ->
      "skeleton"

    Prototype ->
      "enemy"

enemyMovement : Float -> Enemy -> Enemy
enemyMovement distance enemy  =
  case enemy.initDir of
    Left ->
      if (toFloat (floor enemy.x)) == (enemy.initX - distance) then
        { enemy
          | dir = Right
          , vx = enemy.speed
        }
      else if (toFloat (floor enemy.x)) == enemy.initX then
        { enemy
          | dir = Left
          , vx = -1 * enemy.speed
        }
      else enemy

    Right ->
      if (toFloat (floor enemy.x)) == (enemy.initX + distance) then
        { enemy
          | dir = Left
          , vx = -1 * enemy.speed
        }
      else if (toFloat (floor enemy.x)) == enemy.initX then
        { enemy
          | dir = Right
          , vx = enemy.speed
        }
      else enemy

    Up ->
      if (toFloat (floor enemy.y)) == (enemy.initY + distance) then
        { enemy
          | dir = Down
          , vy = -1 * enemy.speed
        }
      else if (toFloat (floor enemy.y)) == enemy.initY then
        { enemy
          | dir = Up
          , vy = enemy.speed
        }
      else enemy

    Down ->
      if (toFloat (floor enemy.y)) == (enemy.initY - distance) then
        { enemy
          | dir = Up
          , vy = enemy.speed
        }
      else if (toFloat (floor enemy.y)) == enemy.initY then
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
            Resources.getTexture ("assets/enemy/" ++ enemyTypeToString enemy ++ "_left.png") resources

          Right ->
            Resources.getTexture ("assets/enemy/" ++ enemyTypeToString enemy ++ "_right.png") resources

          Up ->
            Resources.getTexture ("assets/enemy/" ++ enemyTypeToString enemy ++ "_up.png") resources

          Down ->
            Resources.getTexture ("assets/enemy/" ++ enemyTypeToString enemy ++ "_down.png") resources
    , bottomLeft = ( 0, 0 )
    , topRight = ( 1, 1 )
    , duration = 1
    , numberOfFrames = 2
    , rotation = 0
    , pivot = ( 0, 0 )
    }
