module Player exposing (..)

import Game.TwoD.Render as Render exposing (..)
import Game.Resources as Resources exposing (..)

import Sword exposing (..)


type alias Player =
  { x : Float
  , y : Float
  , vx : Float
  , vy : Float
  , dir : Direction
  , sword : Sword
  --, level : Int
  --, exp : Int
  --, health : Int
  --, attack : Int
  --, defense : Int
  }

type Direction
  = Left
  | Right
  | Up
  | Down
  | Idle

  {-
    Akcie, ktore bude hrac moct vykonavat.
    Resp. spravy, ktore dokaze generovat pre UPDATE.
  type Msg
    = Idle
    | MoveUp
    | MoveDown
    | MoveRight
    | MoveLeft
    | Attack
    | EquipItem   -- nasadit zbran/brnenie po stlaceni buttonu v otvorenom inventari
    | PickUpItem  -- zobrat item zo zeme po stlaceni buttonu a ulozit si ho do inventara
    | UseItem     -- pouzit item (napr. Health Potion) po stlaceni nejakeho buttonu
  -}

textures : List String
textures =
  [ "assets/player/playerIdle.png"
  , "assets/player/playerRight.png"
  , "assets/player/playerLeft.png"
  , "assets/player/playerUp.png"
  , "assets/player/playerDown.png"
  ]

walk : { x : Int, y : Int } -> Player -> Player
walk { x, y } player =
  { player
    | vx = 3 * toFloat x
    , vy = 3 * toFloat y
    , dir =
        if x < 0 then
          Left

        else if x > 0 then
          Right

        else if y < 0 then
          Down

        else if y > 0 then
          Up

        else
          Idle
  }

swordPhysics : Sword -> Player -> Player
swordPhysics sword player =
  { player
    | sword = updateSwordCoordinates sword player.x player.y
  }

renderPlayer : Resources -> Player -> Renderable
renderPlayer resources player =
  Render.animatedSpriteWithOptions
    { position = ( player.x, player.y, -0.1 )
    , size = ( 1, 2 )
    , texture =
        case player.dir of
          Left ->
            Resources.getTexture "assets/player/playerLeft.png" resources

          Right ->
            Resources.getTexture "assets/player/playerRight.png" resources

          Up ->
            Resources.getTexture "assets/player/playerUp.png" resources

          Down ->
            Resources.getTexture "assets/player/playerDown.png" resources

          Idle ->
            Resources.getTexture "assets/player/playerIdle.png" resources
    , bottomLeft = ( 0, 0 )
    , topRight = ( 1, 1 )
    , duration = 1
    , numberOfFrames = 2
    , rotation = 0
    , pivot = ( 0, 0 )
    }
