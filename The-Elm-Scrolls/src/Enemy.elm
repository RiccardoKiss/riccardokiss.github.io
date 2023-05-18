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

type EnemyType
  = Bandit
  | Zombie
  | Skeleton
  | DragonKnight
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
  , "assets/enemy/dragonKnight_right.png"
  , "assets/enemy/dragonKnight_left.png"
  , "assets/enemy/dragonKnight_up.png"
  , "assets/enemy/dragonKnight_down.png"
  --, "assets/enemy/dragonKnight_idle.png"
  ]

prototype : Float -> Float -> Direction -> Enemy
prototype initX initY initDir =
  { initX = initX
  , initY = initY
  , initDir = initDir
  , x = initX
  , y = initY
  , dir = initDir
  , vx = 0
  , vy = 0
  , width = 1.0
  , height = 2.0
  , hostile = False
  , alive = True
  , enemyType = Prototype
  , distanceLoop = 5.0
  , speed = 1.0
  , attack = 1
  , health = 10
  , expDrop = 1
  , detectPlayerRadius = 2
  }

bandit : Float -> Float -> Direction -> Enemy
bandit initX initY initDir  =
  { initX = initX
  , initY = initY
  , initDir = initDir
  , x = initX
  , y = initY
  , dir = initDir
  , vx = 0
  , vy = 0
  , width = 1.0
  , height = 2.0
  , hostile = False
  , alive = True
  , enemyType = Bandit
  , distanceLoop = 5.0
  , speed = 2.0
  , attack = 2
  , health = 15
  , expDrop = 2
  , detectPlayerRadius = 2
  }

zombie : Float -> Float -> Direction -> Enemy
zombie initX initY initDir =
  { initX = initX
  , initY = initY
  , initDir = initDir
  , x = initX
  , y = initY
  , dir = initDir
  , vx = 0
  , vy = 0
  , width = 1.0
  , height = 2.0
  , hostile = False
  , alive = True
  , enemyType = Zombie
  , distanceLoop = 5.0
  , speed = 1.5
  , attack = 5
  , health = 15
  , expDrop = 5
  , detectPlayerRadius = 4
  }

skeleton : Float -> Float -> Direction -> Enemy
skeleton initX initY initDir =
  { initX = initX
  , initY = initY
  , initDir = initDir
  , x = initX
  , y = initY
  , dir = initDir
  , vx = 0
  , vy = 0
  , width = 1.0
  , height = 2.0
  , hostile = False
  , alive = True
  , enemyType = Skeleton
  , distanceLoop = 5.0
  , speed = 2.5
  , attack = 3
  , health = 10
  , expDrop = 3
  , detectPlayerRadius = 3
  }

dragonKnight : Float -> Float -> Direction -> Enemy
dragonKnight initX initY initDir =
  { initX = initX
  , initY = initY
  , initDir = initDir
  , x = initX
  , y = initY
  , dir = initDir
  , vx = 0
  , vy = 0
  , width = 1.0
  , height = 2.0
  , hostile = False
  , alive = True
  , enemyType = DragonKnight
  , distanceLoop = 5.0
  , speed = 2.5
  , attack = 3
  , health = 10
  , expDrop = 3
  , detectPlayerRadius = 3
  }

isAlive : Enemy -> Bool
isAlive enemy =
  if enemy.alive then True else False

isDead : Enemy -> Bool
isDead enemy =
  if enemy.alive then False else True

getAttack : Enemy -> Int
getAttack enemy =
  enemy.attack

getExpDrop : Enemy -> Int
getExpDrop enemy =
  enemy.expDrop

enemyDirToString : Direction -> String
enemyDirToString dir =
  case dir of
    Left ->
      "left"

    Right ->
      "right"

    Up ->
      "up"

    Down ->
      "down"

enemyTypeToString : Enemy -> String
enemyTypeToString enemy =
  case enemy.enemyType of
    Bandit ->
      "bandit"

    Zombie ->
      "zombie"

    Skeleton ->
      "skeleton"

    DragonKnight ->
      "dragonKnight"
      
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
  --let
    --_ = Debug.log "[renderEnemy] enemy.dir" enemy.dir
  --in
  Render.animatedSpriteWithOptions
    { position = ( enemy.x, enemy.y, -0.1 )
    , size = ( enemy.width, enemy.height )  --( 1, 2 )
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
