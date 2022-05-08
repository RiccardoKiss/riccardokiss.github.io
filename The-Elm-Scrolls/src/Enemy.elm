module Enemy exposing (..)

import Game.TwoD.Render as Render exposing (..)
import Game.Resources as Resources exposing (..)

import Tilemap exposing (..)
import Level exposing (..)

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
  , distanceLoop : Float
  , speed : Float
  , attack : Int
  , health : Int
  --, defense : Int
  , expDrop : Int
  , detectPlayerRadius : Float
  , hostile : Bool
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
  , "assets/enemy/skeleton_right.png"
  , "assets/enemy/skeleton_left.png"
  , "assets/enemy/skeleton_up.png"
  , "assets/enemy/skeleton_down.png"
  --, "assets/enemy/skeleton_idle.png"
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

euclideanDistance : Float -> Float -> Float -> Float -> Float
euclideanDistance x1 y1 x2 y2 =
  sqrt ((x2 - x1)^2 + (y2 - y1)^2)

enemyMovement : Float -> Float -> Enemy -> Enemy
enemyMovement playerX playerY enemy =
  let
    playerInRange =
      if euclideanDistance playerX playerY enemy.x enemy.y <= enemy.detectPlayerRadius then
        True
      else
        False
  in
  if playerInRange || enemy.hostile then
    chasePlayer playerX playerY enemy
  else
    enemyLoop enemy

chasePlayer : Float -> Float -> Enemy -> Enemy
chasePlayer playerX playerY enemy =
  let
    xDiff = playerX - enemy.x
    yDiff = playerY - enemy.y
    coefficientVx = xDiff / abs xDiff
    coefficientVy = yDiff / abs yDiff
  in
  { enemy
    | vx = enemy.speed * coefficientVx
    , vy = enemy.speed * coefficientVy
    , hostile = True
    {-, dir =
      if abs xDiff < abs yDiff then
        if xDiff <= 0 then
          Left
        else
          Right
      else
        if yDiff <= 0 then
          Down
        else
          Up-}
      {-else if abs yDiff < abs xDiff then
        if yDiff <= 0 then
          Down
        else
          Up
      else enemy.dir-}
  }

enemyLoop : Enemy -> Enemy
enemyLoop enemy  =
  case enemy.initDir of
    Left ->
      if (toFloat (floor enemy.x)) == (enemy.initX - enemy.distanceLoop) then
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
      if (toFloat (floor enemy.x)) == (enemy.initX + enemy.distanceLoop) then
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
      if (toFloat (floor enemy.y)) == (enemy.initY + enemy.distanceLoop) then
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
      if (toFloat (floor enemy.y)) == (enemy.initY - enemy.distanceLoop) then
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
  let
      _ = Debug.log "[renderEnemy] enemy.dir" enemy.dir
  in
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
