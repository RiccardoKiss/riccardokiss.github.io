module Game exposing  (..)

import Browser
import Browser.Navigation as Nav
import Browser.Events exposing (onAnimationFrameDelta)
import Game.Resources as Resources exposing (..)
import Game.TwoD as Game2d
import Game.TwoD.Camera as Camera exposing (..)
import Game.TwoD.Render as Render exposing (..)
import Html exposing (Html, div, img, text, pre)
import Html.Attributes exposing (style, src)
import Html.Events exposing (on, keyCode)
import Json.Decode as D
import Keyboard exposing (..)
import Keyboard.Arrows
import Player exposing (..)
import Sword exposing (..)
import Enemy exposing (..)
import Task
import Array


-- MODEL


type alias Model =
  { navKey : Nav.Key
  , player : Player
  , enemies : List Enemy
  , resources : Resources
  , keys : List Keyboard.Key
  , key_buttons : KeyButtons
  , time : Float
  , screen : ( Int, Int )
  , camera : Camera
  }

type alias KeyButtons =
  { q : String
  , e : String
  , w : String
  , a : String
  , s : String
  , d : String
  , arrowUp : String
  , arrowLeft : String
  , arrowDown : String
  , arrowRight : String
  , spacebar : String
  }

type alias Input =
  { x : Int, y : Int }

type Msg
  = Tick Float
  | Resources Resources.Msg
  | Keys Keyboard.Msg
  --| KeyDown

getNavKey : Model -> Nav.Key
getNavKey model =
  model.navKey

-- https://stackoverflow.com/questions/52350505/accessing-elements-in-2-dimensional-array-elm
level2Tilemap : Array.Array ( Array.Array Char )
level2Tilemap =
  Array.fromList
    [ Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTEETTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFFFFFFFXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    , Array.fromList (String.toList "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
  ]

getTileTypeFromTileMap : Array.Array ( Array.Array Char ) -> Float -> Float -> Maybe Char
getTileTypeFromTileMap tilemap x y =
    {-
    let
        _ = Debug.log "[getTileTypeFromTileMap] x" (floor x)
        _ = Debug.log "[getTileTypeFromTileMap] y" (floor y)
    in-}
    Array.get (127 - (floor y)) tilemap
    |> Maybe.andThen (Array.get (floor x))
    --|> Debug.log "[getTileTypeFromTileMap] tile"

initSword : Sword
initSword =
  { x = 0
  , y = 0
  , width = 1
  , height = 0.5
  , action = NotAttack
  , sword_type = Stone
  , attack = 5
  }

initPlayer : Player
initPlayer =
  { x = 56
  , y = 9
  , vx = 0
  , vy = 0
  , speed = 3.0
  , width = 1
  , height = 2
  , dir = Player.Idle
  , sword = initSword
  , level = 1
  , maxDefense = 100
  , currentDefense = 10
  , maxHealth = 100
  , currentHealth = 100
  , maxExp = 5
  , currentExp = 0
  }

initEnemy : Enemy
initEnemy =
  { initX = 57
  , initY = 11
  , initDir = Enemy.Up
  , x = 57
  , y = 11
  , vx = 0
  , vy = 0
  , width = 1
  , height = 2
  , dir = Enemy.Up
  , enemyType = Prototype
  , speed = 3.0
  , attack = 1
  , health = 10
  , expDrop = 2
  , alive = True
  }

initEnemy2 : Enemy
initEnemy2 =
  { initX = 55
  , initY = 12
  , initDir = Enemy.Up
  , x = 55
  , y = 12
  , vx = 0
  , vy = 0
  , width = 1
  , height = 2
  , dir = Enemy.Up
  , enemyType = Skeleton
  , speed = 5.0
  , attack = 1
  , health = 10
  , expDrop = 2
  , alive = True
  }

initKeyButtons : KeyButtons
initKeyButtons =
  { q = "assets/button/q.png"
  , e = "assets/button/w.png"
  , w = "assets/button/w.png"
  , a = "assets/button/a.png"
  , s = "assets/button/s.png"
  , d = "assets/button/d.png"
  , arrowUp = "assets/button/arrowUp.png"
  , arrowLeft = "assets/button/arrowLeft.png"
  , arrowDown = "assets/button/arrowDown.png"
  , arrowRight = "assets/button/arrowRight.png"
  , spacebar = "assets/button/spacebar.png"
  }

init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
  ( { navKey = navKey
    , player = initPlayer
    , enemies = [ initEnemy, initEnemy2 ]
    , resources = Resources.init
    , keys = []
    , key_buttons = initKeyButtons
    , time = 0
    , screen = ( 1024, 512 )
    , camera = Camera.fixedArea (32 * 16) ( 0, 0 )
    }
  , Cmd.map Resources (Resources.loadTextures texturesList )
  )

texturesList : List String
texturesList =
  List.concat
    [ [ "assets/level/level_2.png" ]
    , Player.textures
    , Enemy.textures
    , Sword.textures
    ]


-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    Tick dt ->
      ( { model
          | player = tick dt level2Tilemap model.keys model.enemies model.player
          , enemies = List.map (enemyMovement 5.0) model.enemies
                      |> List.map (enemyPhysics dt)
                      |> List.map (enemyAttacked model.player)
          , time = dt + model.time
          , camera = Camera.moveTo ( model.player.x, model.player.y) model.camera
        }
        , Cmd.none
      )

    Resources rMsg ->
      ( { model | resources = Resources.update rMsg model.resources }
      , Cmd.none
      )

    Keys keyMsg ->
      let
        keys = Keyboard.update keyMsg model.keys
        _ = Debug.log "[model.keys]" keys
      in
        ( { model | keys = keys }
        , Cmd.none
        )
    {-
    KeyDown ->
      if List.member Keyboard.Spacebar model.keys then
        let
          k = pressedKeyTexture "spacebar" model.key_buttons
        in
        ( { model | key_buttons = k }, Cmd.none )
      else ( model, Cmd.none )-}


tick :
  Float
  -> Array.Array ( Array.Array Char )
  -> List Keyboard.Key
  -> List Enemy
  -> Player
  -> Player
tick dt tilemap keys enemyList player =
  let
    moveInput =
      Keyboard.Arrows.wasd keys
      --Keyboard.Arrows.arrows keys
  in
  player
    |> Player.walk moveInput
    |> playerPhysics dt
    |> Player.swordPhysics keys player.sword
    |> playerAttacked enemyList

playerPhysics : Float -> Player -> Player
playerPhysics dt player =
  let
    newX = player.x + dt * player.vx
    newY = player.y + dt * player.vy
    tileType =
      if player.dir == Player.Left then
        getTileTypeFromTileMap level2Tilemap (newX - 1) newY
      else if player.dir == Player.Up then
        getTileTypeFromTileMap level2Tilemap newX (newY + 1)
      else
        getTileTypeFromTileMap level2Tilemap newX newY

    --_ = Debug.log "[physics] newX" newX
    --_ = Debug.log "[physics] newY" newY
  in
  { player
    | x =
        case tileType of
          Just tile ->
            if tile == 'T' then
              newX
            else player.x
          Nothing ->
            player.x
    , y =
      case tileType of
        Just tile ->
          if tile == 'T' then
            newY
          else player.y
        Nothing ->
          player.y
  }

enemyPhysics : Float -> Enemy -> Enemy
enemyPhysics dt enemy =
  let
    newX = enemy.x + dt * enemy.vx
    newY = enemy.y + dt * enemy.vy
    tileType =
      if enemy.dir == Enemy.Left then
        getTileTypeFromTileMap level2Tilemap (newX - 1) newY
      else if enemy.dir == Enemy.Up then
        getTileTypeFromTileMap level2Tilemap newX (newY + 1)
      else
        getTileTypeFromTileMap level2Tilemap newX newY
  in
  { enemy
    | x =
        case tileType of
          Just tile ->
            if tile == 'T' then
              newX
            else enemy.x
          Nothing ->
            enemy.x
    , y =
      case tileType of
        Just tile ->
          if tile == 'T' then
            newY
          else enemy.y
        Nothing ->
          enemy.y
  }

playerAttacked : List Enemy -> Player -> Player
playerAttacked enemyList player =
  let
    dmgTaken = List.filter (dmgDoneToPlayer player) enemyList
               |> List.map getAttack
               |> List.sum
    newHp = player.currentHealth - dmgTaken
  in
  { player | currentHealth = if newHp <= 0 then 0 else newHp }

enemyAttacked : Player -> Enemy -> Enemy
enemyAttacked player enemy =
  let
    dmgTaken = dmgDoneToEnemy player.sword enemy
    newHp = enemy.health - dmgTaken
  in
  { enemy
    | health = if newHp <= 0 then 0 else newHp
    , alive = if newHp <= 0 then False else True
  }

dmgDoneToPlayer : Player -> Enemy -> Bool
dmgDoneToPlayer player enemy =
  if player.x + player.width >= enemy.x &&
     player.x <= enemy.x + enemy.width &&
     player.y + player.height >= enemy.y &&
     player.y <= enemy.y + enemy.height
  then True --enemy.attack
  else False --0

dmgDoneToEnemy : Sword -> Enemy -> Int
dmgDoneToEnemy sword enemy =
  if sword.action == Attack then
    if sword.x + sword.width >= enemy.x &&
       sword.x <= enemy.x + enemy.width &&
       sword.y + sword.height >= enemy.y &&
       sword.y <= enemy.y + enemy.height
    then sword.attack
    else 0
  else 0

{-
rectangularCollision :
  { x : Float, y : Float, width : Float, height : Float} ->
  { x : Float, y : Float, width : Float, height : Float} ->
  Bool
rectangularCollision rect1 rect2 =
  rect1.x + rect1.width >= rect2.x &&
  rect1.x <= rect2.x + rect2.width &&
  rect1.y + rect1.height >= rect2.y &&
  rect1.y <= rect2.y + rect2.height
-}

keyButtonTexture : String -> List Keyboard.Key -> String
keyButtonTexture key_button keys =
  let
    assetPath = "assets/button/" ++ key_button ++ ".png"
    pressedPath = String.replace "." "_pressed." assetPath
  in
  if key_button == "spacebar" then
    if List.member (Keyboard.Spacebar) keys then
      pressedPath
    else
      assetPath
  else if key_button == "q" then
    if List.member (Keyboard.Character "Q") keys then
      pressedPath
    else
      assetPath
  else if key_button == "e" then
    if List.member (Keyboard.Character "E") keys then
      pressedPath
    else
      assetPath
  else if key_button == "w" then
    if List.member (Keyboard.Character "W") keys then
      pressedPath
    else
      assetPath
  else if key_button == "a" then
    if List.member (Keyboard.Character "A") keys then
      pressedPath
    else
      assetPath
  else if key_button == "s" then
    if List.member (Keyboard.Character "S") keys then
      pressedPath
    else
      assetPath
  else if key_button == "d" then
    if List.member (Keyboard.Character "D") keys then
      pressedPath
    else
      assetPath
  else if key_button == "arrowUp" then
    if List.member Keyboard.ArrowUp keys then
      pressedPath
    else
      assetPath
  else if key_button == "arrowRight" then
    if List.member Keyboard.ArrowRight keys then
      pressedPath
    else
      assetPath
  else if key_button == "arrowDown" then
    if List.member Keyboard.ArrowDown keys then
      pressedPath
    else
      assetPath
  else if key_button == "arrowLeft" then
    if List.member Keyboard.ArrowLeft keys then
      pressedPath
    else
      assetPath
  else
    ""


onKeyDown : Msg -> Html.Attribute Msg
onKeyDown msg =
  let
    _ = Debug.log "[onKeyDown] msg" msg
  in
  on "keydown" (D.succeed msg) --eventKeyDecoder --(D.map tagger keyCode)

-- VIEW


render : Model -> List Renderable
render ({ resources, camera } as model) =
  List.concat
    [ renderBackground resources
    , [ Player.renderPlayer resources model.player
      , renderSword resources model.player.sword model.keys
      ]
    , List.filter Enemy.isAlive model.enemies
      |> List.map (Enemy.renderEnemy resources)
    ]

renderBackground : Resources -> List Renderable
renderBackground resources =
  [ Render.spriteZ
    { texture = Resources.getTexture "assets/level/level_2.png" resources
    , position = ( 0, 0, -0.9 )
    , size = ( 128, 128 )
    }
  ]

renderSword : Resources -> Sword -> List Keyboard.Key -> Renderable
renderSword resources sword keys =
  if List.member Keyboard.Spacebar keys then
    Sword.renderSwordAttack resources sword
  else
    Sword.renderSwordIdle resources sword

viewDefenseInfo : Int -> Int -> Html Msg
viewDefenseInfo maxDef currDef =
  div [ style "position" "absolute"
      , style "font-family" "monospace"
      , style "color" "white"
      , style "top" "30%"
      , style "left" "47.5%"
      ]
      [ text (String.fromInt currDef ++ " / " ++ String.fromInt maxDef)]

viewDefenseBar : Int -> Int -> Int -> Int -> Html Msg
viewDefenseBar left top maxDef currDef =
  let
    defensePercentage =  (toFloat currDef / toFloat maxDef) * 100.0
  in
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ img [ src "assets/defense_bar.png" ] []
      , div [style "position" "absolute"
            , style "left" "16px"
            , style "top" "16px"
            ]
            [ img [ src "assets/defense_bar_current.svg"
                  , style "height" "16px"
                  , style "width" (String.fromFloat defensePercentage ++ "%")
                  ] []
            ]
      , viewDefenseInfo maxDef currDef
      ]

viewHealthInfo : Int -> Int -> Html Msg
viewHealthInfo maxHp currHp =
  div [ style "position" "absolute"
      , style "font-family" "monospace"
      , style "color" "white"
      , style "top" "30%"
      , style "left" "47.5%"
      ]
      [ text (String.fromInt currHp ++ " / " ++ String.fromInt maxHp)]

viewHealthBar : Int -> Int -> Int -> Int -> Html Msg
viewHealthBar left top maxHp currHp =
  let
    healthPercentage =  (toFloat currHp / toFloat maxHp) * 100.0
  in
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ img [ src "assets/health_bar.png" ] []
      , div [style "position" "absolute"
            , style "left" "16px"
            , style "top" "12px"
            ]
            [ img [ src "assets/health_bar_current.svg"
                  , style "height" "24px"
                  , style "width" (String.fromFloat healthPercentage ++ "%")
                  ] []
            ]
      , viewHealthInfo maxHp currHp
      ]

viewExpInfo : Int -> Int -> Html Msg
viewExpInfo maxExp currExp =
  div [ style "position" "absolute"
      , style "font-family" "monospace"
      , style "color" "white"
      , style "top" "30%"
      , style "left" "47.5%"
      ]
      [ text (String.fromInt currExp ++ " / " ++ String.fromInt maxExp)]

viewExpBar : Int -> Int -> Int -> Int -> Html Msg
viewExpBar left top maxExp currExp =
  let
    expPercentage =  (toFloat currExp / toFloat maxExp) * 100.0
  in
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ img [ src "assets/exp_bar.png" ] []
      , div [style "position" "absolute"
            , style "left" "16px"
            , style "top" "16px"
            ]
            [ img [ src "assets/exp_bar_current.svg"
                  , style "height" "16px"
                  , style "width" (String.fromFloat expPercentage ++ "%")
                  ] []
            ]
      , viewExpInfo maxExp currExp
      ]

viewConsumable1 : Int -> Int -> List Keyboard.Key -> Html Msg
viewConsumable1 left top keys =
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ img [ src "assets/item/consumable_background.png"
            ] []
      , div [ style "position" "absolute"
            , style "left" "0px"
            , style "top" "0px"
            ]
            [ img [ src "assets/item/health_potion.png" ] []
            ]
      , div [ style "position" "absolute"
            , style "left" "16px"
            , style "top" "67px"
            ]
            [ img [ src (keyButtonTexture "q" keys) ] [] ]
      ]

viewConsumable2 : Int -> Int -> List Keyboard.Key -> Html Msg
viewConsumable2 left top keys =
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ img [ src "assets/item/consumable_background.png"
            ] []
      , div [ style "position" "absolute"
            , style "left" "0px"
            , style "top" "0px"
            ]
            [ img [ src "assets/item/speed_potion.png" ] []
            ]
      , div [ style "position" "absolute"
            , style "left" "16px"
            , style "top" "67px"
            ]
            [ img [ src (keyButtonTexture "e" keys) ] [] ]
      ]

viewPlayerInput : Int -> Int -> List Keyboard.Key -> Html Msg
viewPlayerInput left top keys =
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ div [ style "position" "absolute"
            , style "left" "34px"
            ] [ img [ src (keyButtonTexture "w" keys) ] [] ]
      , div [ style "position" "absolute"
            --, style "left" "34px"
            , style "top" "34px"
            ] [ img [ src (keyButtonTexture "a" keys) ] [] ]
      , div [ style "position" "absolute"
            , style "left" "34px"
            , style "top" "34px"
            ] [ img [ src (keyButtonTexture "s" keys) ] [] ]
      , div [ style "position" "absolute"
            , style "left" "68px"
            , style "top" "34px"
            ] [ img [ src (keyButtonTexture "d" keys) ] [] ]
      , div [ style "position" "absolute"
            , style "left" "170px"
            , style "top" "34px"
            ] [ img [ src (keyButtonTexture "spacebar" keys) ] [] ]
      ]

viewPlayerCoordinates : Int -> Int -> Player -> Html Msg
viewPlayerCoordinates left top player =
  pre [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ text "Player"
      , text ("\nx: " ++ String.fromFloat player.x)
      , text ("\ny: " ++ String.fromFloat player.y)
      , text ("\nvx: " ++ String.fromFloat player.vx)
      , text ("\nvy: " ++ String.fromFloat player.vy)
      --, text ("\nhp: " ++ String.fromInt player.currentHealth
      --        ++ " / " ++ String.fromInt player.maxHealth)
      ]

view : Model -> { title : String, content : Html Msg }
view model =
  { title = "Game"
  , content =
    div []
      [ img [ src "assets/default_background_1920_969.png"
            , style "display" "block"
            , style "position" "relative"
            , style "left" "0px"
            , style "top" "0px"
            ] []
      , Game2d.renderWithOptions
          [ style "position" "absolute"
          , style "left" "448px"
          , style "top" "100px" --"228px"
          , style "border" "solid 1px #FFF"
          ]
            { camera = model.camera
            , time = model.time
            , size = model.screen
            }
              (render model)
      , viewPlayerCoordinates 100 100 model.player
      , viewDefenseBar 448 617 model.player.maxDefense model.player.currentDefense
      , viewHealthBar 448 665 model.player.maxHealth model.player.currentHealth
      , viewExpBar 448 713 model.player.maxExp model.player.currentExp
      , viewConsumable1 368 650 model.keys
      , viewConsumable2 1488 650 model.keys
      , viewPlayerInput 820 761 model.keys
      ]
  }


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ Sub.map Keys Keyboard.subscriptions
    , onAnimationFrameDelta ((\dt -> dt / 1000) >> Tick)
    ]
