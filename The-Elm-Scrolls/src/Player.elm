module Player exposing (..)

import Game.TwoD.Render as Render exposing (..)
import Game.Resources as Resources exposing (..)
import Keyboard

import Sword exposing (..)


type alias Player =
  { x : Float
  , y : Float
  , vx : Float
  , vy : Float
  , speed : Float
  , width : Float
  , height : Float
  , dir : Direction
  , sword : Sword
  , maxDefense : Int
  , currentDefense : Int
  , maxHealth : Int
  , currentHealth : Int
  , playerLevel : Int
  , maxExp : Int
  , currentExp : Int
  , healthPotionCount : Int
  , speedPotionCount : Int
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
  [ "assets/player/player_EEE_idle.png"
  , "assets/player/player_EEE_right.png"
  , "assets/player/player_EEE_left.png"
  , "assets/player/player_EEE_up.png"
  , "assets/player/player_EEE_down.png"
  ]

walk : { x : Int, y : Int } -> Player -> Player
walk { x, y } player =
  { player
    | vx = player.speed * toFloat x
    , vy = player.speed * toFloat y
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

swordPhysics : List Keyboard.Key -> Sword -> Player -> Player
swordPhysics keys sword player =
  { player
    | sword = Sword.updateSwordCoordinates sword player.x player.y
              |> Sword.swordAttack keys
  }

renderPlayer : Resources -> Player -> Renderable
renderPlayer resources player =
  Render.animatedSpriteWithOptions
    { position = ( player.x, player.y, -0.1 )
    , size = ( 1, 2 )
    , texture =
        case player.dir of
          Left ->
            Resources.getTexture "assets/player/player_EEE_left.png" resources

          Right ->
            Resources.getTexture "assets/player/player_EEE_right.png" resources

          Up ->
            Resources.getTexture "assets/player/player_EEE_up.png" resources

          Down ->
            Resources.getTexture "assets/player/player_EEE_down.png" resources

          Idle ->
            Resources.getTexture "assets/player/player_EEE_idle.png" resources
    , bottomLeft = ( 0, 0 )
    , topRight = ( 1, 1 )
    , duration = 1
    , numberOfFrames = 2
    , rotation = 0
    , pivot = ( 0, 0 )
    }
