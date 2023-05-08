module Game exposing  (..)

import Browser
import Browser.Navigation as Nav
import Browser.Events exposing (onAnimationFrameDelta)
import Game.Resources as Resources exposing (..)
import Game.TwoD as Game2d
import Game.TwoD.Camera as Camera exposing (..)
import Game.TwoD.Render as Render exposing (..)
import Html exposing (Html, div, img, text, pre, p, a, span)
import Html.Attributes exposing (style, src)
import Html.Events exposing (on, keyCode, onClick, onMouseOver, onMouseOut)
import Json.Decode as Decode
import Json.Encode as Encode
import Keyboard exposing (..)
import Keyboard.Arrows
import Task
import Array

import Route exposing (Route)
import DecodingJson exposing (..)
import Ports exposing (..)
import Tilemap exposing (..)
import Level exposing (..)
import Player exposing (..)
import Sword exposing (..)
import Enemy exposing (..)
import Item exposing (..)
import Armor exposing (..)
import Potion exposing (..)
import Settings exposing (..)


-- MODEL


type alias Model =
  { navKey : Nav.Key
  , savePosition : SavePosition
  , name : String
  , difficulty : DecodingJson.Difficulty
  , level :  Level.Level
  , player : Player
  , resources : Resources
  , keys : List Keyboard.Key
  , time : Float
  , screen : ( Int, Int )
  , camera : Camera
  , pauseToggle : Bool
  , music : Settings.Music
  , movement : Settings.Movement
  , button_DS_respawn : String
  , button_DS_return : String
  , button_PS_resume : String
  , button_PS_settings : String
  , button_PS_help : String
  , button_PS_return : String
  }

type alias Input =
  { x : Int, y : Int }

type SavePosition
  = First
  | Second
  | Third

type Button
  = DeathScreenRespawn
  | DeathScreenReturn
  | PauseScreenResume
  | PauseScreenSettings
  | PauseScreenHelp
  | PauseScreenReturn

type Msg
  = Tick Float
  | Resources Resources.Msg
  | Keys Keyboard.Msg
  | Hover Button
  | MouseOut Button
  | ClickResume
  | SaveGame
  | Reload Bool


initPlayer : Level.Level -> Player
initPlayer level =
  { x = level.startX --56
  , y = level.startY --9
  , vx = 0
  , vy = 0
  , baseSpeed = 3.0
  , currentSpeed = 3.0
  , width = 1.0
  , height = 2.0
  , dir = Player.Idle
  , sword = Sword.woodSword
  , armor = Armor.noneArmorSet
  , maxDefense = 100
  --, currentDefense = 10
  , maxHealth = 100
  , currentHealth = 50
  , playerLevel = 1
  , maxExp = 5
  , currentExp = 0
  , healthPotions = Potion.healthPotion 0.1 0.0 3.0 0.0 0
  , speedPotions = Potion.speedPotion 1.5 5.0 5.0 0.0 0
  }

init : Maybe DecodingJson.Save -> SavePosition -> Maybe DecodingJson.Settings -> Nav.Key -> ( Model, Cmd Msg )
init save pos settings navKey =
  let
    _ = Debug.log "[Game.init] save" save
    _ = Debug.log "[Game.init] pos" pos
    _ = Debug.log "[Game.init] settings" settings
  in
  ( { navKey = navKey
    , savePosition = pos
    , name =
        case save of
          Just s ->
            case s.name of
              Just name ->
                name

              Nothing ->
                "PLAYER"

          Nothing ->
            "PLAYER"

    , difficulty =
        case save of
          Just s ->
            s.difficulty
            {-
            case s.difficulty of
              "easy" ->
                DecodingJson.Easy

              "medium" ->
                DecodingJson.Medium

              "hard" ->
                DecodingJson.Hard

              _ ->
                DecodingJson.Easy
                -}
          Nothing ->
            DecodingJson.Easy

    , level =
        case save of
          Just s ->
            case s.level of
              Just lvl ->
                lvl

              Nothing ->
                Level.level2

          Nothing ->
            Level.level2
    , player =
        case save of
          Just s ->
            case s.player of
              Just p ->
                p

              Nothing ->
                initPlayer Level.level2

          Nothing ->
            initPlayer Level.level2
    , resources = Resources.init
    , keys = []
    , time =
        case save of
          Just s ->
            s.time

          Nothing ->
            0.0
    , screen = ( 1280, 720 )
    , camera = Camera.fixedArea (32 * 16) ( 0, 0 ) --(16 * 8) ( 0, 0 )
    , pauseToggle = False
    , music =
        case settings of
          Just s ->
            s.music

          Nothing ->
            Settings.Off
    , movement =
        case settings of
          Just s ->
            s.movement

          Nothing ->
            Settings.WASD
    , button_DS_respawn = "assets/button/button_DS_respawn.png"
    , button_DS_return = "assets/button/button_DS_return_MainMenu.png"
    , button_PS_resume = "assets/button/button_resume.png"
    , button_PS_settings = "assets/button/button_settings.png"
    , button_PS_help = "assets/button/button_help.png"
    , button_PS_return = "assets/button/button_return_MainMenu.png"
    }
  , Cmd.batch
      [ Ports.loadedPage ()
      , Cmd.map Resources ( Resources.loadTextures texturesList )
      ]
  )

texturesList : List String
texturesList =
  List.concat
    [ Level.textures
    , Player.textures
    , Enemy.textures
    , Sword.textures
    , Item.textures
    ]


-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    Tick dt ->
      let
        playerWithExp = getExp model.level.enemies model.player
        enemies = List.filter Enemy.isAlive model.level.enemies
        --items = List.filter Item.isPickable model.level.items
      in
      ( { model
          | player = playerTick dt model.time model.level model.keys model.movement enemies playerWithExp
          , level =  levelTick dt model.pauseToggle model.player model.level --enemies model.level.items
          , pauseToggle =
              if model.player.currentHealth == 0 then
                True
              else
                model.pauseToggle
          , time =
              if model.pauseToggle then
                model.time
              else
                model.time + dt
          , camera = Camera.moveTo ( model.player.x, model.player.y ) model.camera
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
        --_ = Debug.log "[model.keys]" keys
      in
      ( { model
          | keys =
            if model.pauseToggle then
              []
            else
              keys
        , pauseToggle =
            if model.player.currentHealth > 0 then
              if List.member Keyboard.Escape keys then
                not model.pauseToggle
              else
                model.pauseToggle
            else
              model.pauseToggle

        }
      , if List.member Keyboard.Escape keys && not model.pauseToggle then
          encodeSave model
          --Cmd.batch
          --  [ saveTime model.time
          --  , savePlayer model.player
          --  , saveLevel model.level
          --  ]
        else
          Cmd.none
      )

    Hover button ->
      case button of
        DeathScreenRespawn ->
          ( { model
            | button_DS_respawn = "assets/button/button_DS_respawn_hover.png"
            }
          , Cmd.none
          )

        DeathScreenReturn ->
          ( { model
            | button_DS_return = "assets/button/button_DS_return_MainMenu_hover.png"
            }
          , Cmd.none
          )

        PauseScreenResume ->
          ( { model
            | button_PS_resume = "assets/button/button_resume_hover.png"
            }
          , Cmd.none
          )

        PauseScreenSettings ->
          ( { model
            | button_PS_settings = "assets/button/button_settings_hover.png"
            }
          , Cmd.none
          )

        PauseScreenHelp ->
          ( { model
            | button_PS_help = "assets/button/button_help_hover.png"
            }
          , Cmd.none
          )

        PauseScreenReturn ->
          ( { model
            | button_PS_return = "assets/button/button_return_MainMenu_hover.png"
            }
          , Cmd.none
          )

    MouseOut button ->
      case button of
        DeathScreenRespawn ->
          ( { model
            | button_DS_respawn = "assets/button/button_DS_respawn.png"
            }
          , Cmd.none
          )

        DeathScreenReturn ->
          ( { model
            | button_DS_return = "assets/button/button_DS_return_MainMenu.png"
            }
          , Cmd.none
          )

        PauseScreenResume ->
          ( { model
            | button_PS_resume = "assets/button/button_resume.png"
            }
          , Cmd.none
          )

        PauseScreenSettings ->
          ( { model
            | button_PS_settings = "assets/button/button_settings.png"
            }
          , Cmd.none
          )

        PauseScreenHelp ->
          ( { model
            | button_PS_help = "assets/button/button_help.png"
            }
          , Cmd.none
          )

        PauseScreenReturn ->
          ( { model
            | button_PS_return = "assets/button/button_return_MainMenu.png"
            }
          , Cmd.none
          )

    ClickResume ->
      ( { model | pauseToggle = False }
      , Cmd.none
      )

    SaveGame ->
      ( model
      , encodeSave model
      --,  Cmd.batch
      --    [ saveTime model.time
      --    , savePlayer model.player
      --    , saveLevel model.level
      --    ]
      )

    Reload rel ->
      if rel then
        ( model, Nav.reload )
      else
        ( model, Cmd.none )


encodeSave : Model -> Cmd msg
encodeSave model =
  let
    encodedSave =
      Encode.object
        [ ( "name", Encode.string model.name )
        , ( "difficulty", Encode.string (DecodingJson.difficultyToString model.difficulty) )
        , ( "player", Encode.object (savePlayer model.player) )
        , ( "level", Encode.object (saveLevel model.level) )
        , ( "time", Encode.float model.time )
        ]
  in
  case model.savePosition of
    First ->
      Ports.storeSave1 encodedSave

    Second ->
      Ports.storeSave2 encodedSave

    Third ->
      Ports.storeSave3 encodedSave

saveEnemy : Enemy -> List (String, Encode.Value)
saveEnemy enemy =
  --Encode.object
    [ ( "initX", Encode.float enemy.initX )
    , ( "initY", Encode.float enemy.initY )
    , ( "initDir", Encode.string (enemyDirToString enemy) )
    , ( "x", Encode.float enemy.x )
    , ( "y", Encode.float enemy.y )
    , ( "vx", Encode.float enemy.vx )
    , ( "vy", Encode.float enemy.vy )
    , ( "dir", Encode.string (enemyDirToString enemy) )
    , ( "width", Encode.float enemy.width )
    , ( "height", Encode.float enemy.height )
    , ( "enemyType", Encode.string (enemyTypeToString enemy) )
    , ( "distanceLoop", Encode.float enemy.distanceLoop )
    , ( "speed", Encode.float enemy.speed )
    , ( "attack", Encode.int enemy.attack )
    , ( "health", Encode.int enemy.health )
    , ( "expDrop", Encode.int enemy.expDrop )
    , ( "detectPlayerRadius", Encode.float enemy.detectPlayerRadius )
    , ( "hostile", Encode.bool enemy.hostile )
    , ( "alive", Encode.bool enemy.alive )
    ]

saveItem : Item -> List (String, Encode.Value)
saveItem item =
  --Encode.object
    [ ( "x", Encode.float item.x )
    , ( "y", Encode.float item.y )
    , ( "width", Encode.float item.width )
    , ( "height", Encode.float item.height )
    , ( "itemType", Encode.string (itemTypeToString item) )
    , ( "pickable", Encode.bool item.pickable )
    ]

saveLevel : Level -> List (String, Encode.Value)--Cmd msg
saveLevel level =
  let
    encodeEnemies = List.map saveEnemy level.enemies
    encodeItems = List.map saveItem level.items
    encodeLevel =
      --Encode.object
        [ ( "map", Encode.string (mapToString level) )
        , ( "mapTexture", Encode.string level.mapTexture )
        , ( "enemies", Encode.list Encode.object encodeEnemies )
        , ( "items", Encode.list Encode.object encodeItems )
        , ( "startX", Encode.float level.startX )
        , ( "startY", Encode.float level.startY )
        ]
  in
  encodeLevel
  --|> Ports.storeLevel

savePotion : Potion -> List (String, Encode.Value)
savePotion potion =
  [ ( "ratio", Encode.float potion.ratio )
  , ( "duration", Encode.float potion.duration )
  , ( "cooldown", Encode.float potion.cooldown )
  , ( "timeOfLastUse", Encode.float potion.timeOfLastUse )
  , ( "count", Encode.int potion.count )
  ]

savePlayer : Player -> List (String, Encode.Value)--Cmd msg
savePlayer player =
  let
    encodePlayer =
      --Encode.object
        [ ( "x", Encode.float player.x )
        , ( "y", Encode.float player.y )
        --, ( "vx", Encode.float player.vx )
        --, ( "vy", Encode.float player.vy )
        , ( "baseSpeed", Encode.float player.baseSpeed )
        , ( "currentSpeed", Encode.float player.currentSpeed )
        --, ( "dir", Encode.string (playerDirToString player) )
        , ( "sword", Encode.string (swordTypeToString player.sword) )
        , ( "armor", Encode.string (armorTypeToString player.armor) )
        , ( "maxDefense", Encode.int player.maxDefense )
        , ( "maxHealth", Encode.int player.maxHealth )
        , ( "currentHealth", Encode.int player.currentHealth )
        , ( "playerLevel", Encode.int player.playerLevel )
        , ( "maxExp", Encode.int player.maxExp )
        , ( "currentExp", Encode.int player.currentExp )
        , ( "healthPotions", Encode.object (savePotion player.healthPotions) )
        , ( "speedPotions", Encode.object (savePotion player.speedPotions) )
        ]
  in
  encodePlayer
  --|> Ports.storePlayer


playerTick :
  Float
  -> Float
  -> Level
  -> List Keyboard.Key
  -> Settings.Movement
  -> List Enemy
  -> Player
  -> Player
playerTick dt time lvl keys movement enemyList player =
  let
    moveInput =
      case movement of
        WASD ->
          Keyboard.Arrows.wasd keys

        Arrows ->
          Keyboard.Arrows.arrows keys
  in
  player
  |> Player.applyHealthPotion keys time
  |> Player.applySpeedPotion keys time
  |> Player.walk moveInput
  |> playerPhysics dt lvl
  |> Player.swordPhysics keys
  |> playerAttacked enemyList

playerPhysics : Float -> Level -> Player -> Player
playerPhysics dt lvl player =
  let
    newX = player.x + dt * player.vx
    newY = player.y + dt * player.vy
    tileType =
      if player.dir == Player.Left then
        Tilemap.getTileTypeFromTileMap lvl.map (newX - 1) newY
      else if player.dir == Player.Up then
        Tilemap.getTileTypeFromTileMap lvl.map newX (newY + 1)
      else
        Tilemap.getTileTypeFromTileMap lvl.map newX newY
    newTileItemStand = List.filter (Item.checkItemStandByCoordinates (round newX) (round newY)) lvl.items
    --_ = Debug.log "[playerPhysics] newTileItemStand" newTileItemStand
  in
  { player
    | x =
        case tileType of
          Just tile ->
            if tile == 'T' then
              if List.isEmpty newTileItemStand then   -- if item stand is not on the new tile, player can move
                newX
              else player.x
            else player.x
          Nothing ->
            player.x
    , y =
        case tileType of
          Just tile ->
            if tile == 'T' then
              if List.isEmpty newTileItemStand then   -- if item stand is not on the new tile, player can move
                newY
              else player.y
            else player.y
          Nothing ->
            player.y
    , sword =
        case List.head newTileItemStand of
          Just itemStand ->
            if Item.getItemType itemStand == WoodSword_ItemStand then
              Sword.woodSword
            else if Item.getItemType itemStand == StoneSword_ItemStand then
              Sword.stoneSword
            else if Item.getItemType itemStand == IronSword_ItemStand then
              Sword.ironSword
            else if Item.getItemType itemStand == DragonSword_ItemStand then
              Sword.dragonSword
            else player.sword
          Nothing ->
            player.sword
    , armor =
        case List.head newTileItemStand of
          Just itemStand ->
            if Item.getItemType itemStand == LeatherArmor_ItemStand then
              Armor.leatherArmorSet
            else if Item.getItemType itemStand == SilverArmor_ItemStand then
              Armor.silverArmorSet
            else if Item.getItemType itemStand == DragonArmor_ItemStand then
              Armor.dragonArmorSet
            else player.armor
          Nothing ->
            player.armor
    , healthPotions =
        case List.head newTileItemStand of
          Just itemStand ->
            if Item.getItemType itemStand == HealthPotion_ItemStand then
              incrementPotionsCount player.healthPotions
            else player.healthPotions
          Nothing ->
            player.healthPotions
    , speedPotions =
        case List.head newTileItemStand of
          Just itemStand ->
            if Item.getItemType itemStand == SpeedPotion_ItemStand then
              incrementPotionsCount player.speedPotions
            else player.speedPotions
          Nothing ->
            player.speedPotions
  }

getExp : List Enemy -> Player -> Player
getExp enemyList player =
  let
    expGained =
      List.filter Enemy.isDead enemyList
      |> List.map Enemy.getExpDrop
      |> List.sum
  in
  if player.currentExp + expGained <= player.maxExp then
    { player
      | currentExp = player.currentExp + expGained
    }
  else
    { player
      | playerLevel = player.playerLevel + 1
      , currentExp = player.currentExp + expGained - player.maxExp
    }

levelTick : Float -> Bool -> Player -> Level.Level -> Level.Level
levelTick dt pauseToggle player level =
  if pauseToggle then
    level
  else
  { level
    | enemies = enemiesTick dt player level
    , items = itemsTick dt player level
  }

itemsTick : Float -> Player -> Level.Level -> List Item
itemsTick dt player level =
  let
    newX = player.x + dt * player.vx
    newY = player.y + dt * player.vy
    --_ = Debug.log "[itemsTick] items" items
  in
  List.map (Item.updateItemStand (round newX) (round newY)) level.items

enemiesTick : Float -> Player -> Level.Level -> List Enemy
enemiesTick dt player level =
  List.filter Enemy.isAlive level.enemies
  |> List.map (Enemy.enemyMovement player.x player.y)
  |> List.map (enemyPhysics dt level.map player)
  |> List.map (enemyAttacked player)

enemyPhysics : Float -> Level.Map -> Player -> Enemy -> Enemy
enemyPhysics dt lvl player enemy =
  let
    newX = enemy.x + dt * enemy.vx
    xDiff = abs (player.x - newX)
    --_ = Debug.log "[XDiff]" xDiff
    newY = enemy.y + dt * enemy.vy
    tileType =
      if enemy.dir == Enemy.Left then
        Tilemap.getTileTypeFromTileMap lvl (newX - 1) newY
      else if enemy.dir == Enemy.Up then
        Tilemap.getTileTypeFromTileMap lvl newX (newY + 1)
      else
        Tilemap.getTileTypeFromTileMap lvl newX newY
  in
  case tileType of
    Just tile ->
      if tile == 'T' then
        if collisionPlayerEnemy player enemy then   -- after collision with player, enemy takes a step back
          case enemy.dir of
            Enemy.Left ->
              { enemy | x = enemy.x + 1 }

            Enemy.Right ->
              { enemy | x = enemy.x - 1 }

            Enemy.Up ->
              { enemy | y = enemy.y - 1 }

            Enemy.Down ->
              { enemy | y = enemy.y + 1 }
        else
          { enemy
            | x = newX
            , y = newY
            , dir =
              if xDiff < 0.10 then -- newX == enemy.x
                if newY > enemy.y then
                  Enemy.Up
                else -- newY < enemy.y
                  Enemy.Down
              else if newX < enemy.x  then
                Enemy.Left --enemy.dir
              else -- if newX > enemy.x then
                Enemy.Right --enemy,dir
          }
      else
        enemy

    Nothing ->
      enemy

playerAttacked : List Enemy -> Player -> Player
playerAttacked enemyList player =
  let
    dmgTaken = List.filter (collisionPlayerEnemy player) enemyList
               |> List.map Enemy.getAttack
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
  if dmgTaken > 0 then
    { enemy
      | health = if newHp <= 0 then 0 else newHp
      , alive = if newHp <= 0 then False else True
      , x =
        if enemy.dir == Enemy.Left then
          enemy.x + 2
        else if enemy.dir == Enemy.Right then
          enemy.x - 2
        else
          enemy.x
      , y =
        if enemy.dir == Enemy.Down then
          enemy.y + 2
        else if enemy.dir == Enemy.Up then
          enemy.y - 2
        else
          enemy.y
    }
  else
    enemy


collisionPlayerEnemy : Player -> Enemy -> Bool
collisionPlayerEnemy player enemy =
  if player.x + player.width >= enemy.x &&
     player.x <= enemy.x + enemy.width &&
     player.y + player.height >= enemy.y &&
     player.y <= enemy.y + enemy.height
  then True --enemy.attack
  else False --0

collisionSwordEnemy : Sword -> Enemy -> Bool
collisionSwordEnemy sword enemy =
  if sword.x + sword.width >= enemy.x &&
     sword.x <= enemy.x + enemy.width &&
     sword.y + sword.height >= enemy.y &&
     sword.y <= enemy.y + enemy.height
  then True
  else False

dmgDoneToEnemy : Sword -> Enemy -> Int
dmgDoneToEnemy sword enemy =
  if sword.action == Attack then
    if collisionSwordEnemy sword enemy then
      sword.attack
    else 0
  else 0

keyButtonTexture : String -> List Keyboard.Key -> String
keyButtonTexture keyButton keys =
  let
    assetPath = "assets/button/" ++ keyButton ++ "_48_48.png"
    pressedPath = String.replace "." "_pressed." assetPath
  in
  if keyButton == "spacebar" then
    if List.member (Keyboard.Spacebar) keys then
      "assets/button/spacebar_192_48_pressed.png"
    else
      "assets/button/spacebar_192_48.png"
  else if keyButton == "w" then
    if List.member (Keyboard.Character "W") keys then
      pressedPath
    else
      assetPath
  else if keyButton == "a" then
    if List.member (Keyboard.Character "A") keys then
      pressedPath
    else
      assetPath
  else if keyButton == "s" then
    if List.member (Keyboard.Character "S") keys then
      pressedPath
    else
      assetPath
  else if keyButton == "d" then
    if List.member (Keyboard.Character "D") keys then
      pressedPath
    else
      assetPath
  else if keyButton == "arrowUp" then
    if List.member Keyboard.ArrowUp keys then
      pressedPath
    else
      assetPath
  else if keyButton == "arrowRight" then
    if List.member Keyboard.ArrowRight keys then
      pressedPath
    else
      assetPath
  else if keyButton == "arrowDown" then
    if List.member Keyboard.ArrowDown keys then
      pressedPath
    else
      assetPath
  else if keyButton == "arrowLeft" then
    if List.member Keyboard.ArrowLeft keys then
      pressedPath
    else
      assetPath
  else
    ""


-- VIEW


render : Model -> List Renderable
render ({ resources, camera } as model) =
  List.concat
    [ renderBackground resources
    , [ Player.renderPlayer resources model.player
      , Sword.renderSword resources model.player.sword
      ]
    , List.filter Enemy.isAlive model.level.enemies
      |> List.map (Enemy.renderEnemy resources)
    , List.map (Item.renderItemStand resources) model.level.items
    ]

renderBackground : Resources -> List Renderable
renderBackground resources =
  [ Render.spriteZ
    { texture = Resources.getTexture "assets/level/level_2_updated.png" resources
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

viewConsumableKeyCooldown : List Keyboard.Key -> String -> Float -> Potion -> Html Msg
viewConsumableKeyCooldown keys key time potion =
  let
    tmpPercentage = ((time - potion.timeOfLastUse) * 100.0) / potion.cooldown
    cooldownPercentage =
      if tmpPercentage > 100.0 || potion.timeOfLastUse == 0.0 then
        100.0
      else tmpPercentage
    assetPath =
      if cooldownPercentage == 100.0 then
        "assets/button/consumable_key_48_48_ready.png"
      else
        "assets/button/consumable_key_48_48_cooldown.svg"
  in
  if List.member (Keyboard.Character key) keys then
    div [] []
  else
    div [ style "position" "absolute"
        , style "left" "0px"
        , style "top" "0px"
        ]
        [ img [ src assetPath
              , style "width" (String.fromFloat cooldownPercentage ++ "%")  -- height
              , style "height" "48px" -- width
              ] []
        ]

viewConsumable1 : Int -> Int -> List Keyboard.Key -> Float -> Potion -> Html Msg
viewConsumable1 left top keys time healthPotion =
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ img [ src "assets/item/consumable_background_96_96.png" ] []
      , div [ style "position" "absolute"
            , style "left" "0px"
            , style "top" "0px"
            ]
            [ img [ src "assets/item/health_potion_96_96.png" ] []
            ]
      , div [ style "position" "absolute"
            , style "left" "45px"
            , style "top" "78px"
            , style "color" "white"
            ]
            [ text  (String.fromInt healthPotion.count) ]
      , div [ style "position" "absolute"
            , style "left" "24px"
            , style "top" "100px"
            ]
            [ img [ src "assets/button/consumable_key_48_48_pressed.png" ] []--(keyButtonTexture "q" keys) ] []
            , viewConsumableKeyCooldown keys "Q" time healthPotion
            , div [ style "position" "absolute"
                  , style "left" "0px"
                  , style "top" "0px"
                  ]
                  [ img [ src "assets/button/q_48_48_transparent.png" ] [] ]
            ]
      ]

viewConsumable2 : Int -> Int -> List Keyboard.Key -> Float -> Potion -> Html Msg
viewConsumable2 left top keys time speedPotion =
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ img [ src "assets/item/consumable_background_96_96.png" ] []
      , div [ style "position" "absolute"
            , style "left" "0px"
            , style "top" "0px"
            ]
            [ img [ src "assets/item/speed_potion_96_96.png" ] []
            ]
      , div [ style "position" "absolute"
            , style "left" "45px"
            , style "top" "78px"
            , style "color" "white"
            ]
            [ text  (String.fromInt speedPotion.count) ]
      , div [ style "position" "absolute"
            , style "left" "24px"
            , style "top" "100px"
            ]
            [ img [ src "assets/button/consumable_key_48_48_pressed.png" ] []--(keyButtonTexture "e" keys) ] []
            , viewConsumableKeyCooldown keys "E" time speedPotion
            , div [ style "position" "absolute"
                  , style "left" "0px"
                  , style "top" "0px"
                  ]
                  [ img [ src "assets/button/e_48_48_transparent.png" ] [] ]
            ]
      ]

viewPlayerInput : Int -> Int -> List Keyboard.Key -> Settings.Movement -> Html Msg
viewPlayerInput left top keys movement =
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ div [ style "position" "absolute"
            , style "left" "52px"
            ] [ img [ src (case movement of
                            WASD ->
                              keyButtonTexture "w" keys
                            Arrows ->
                              keyButtonTexture "arrowUp" keys
                          )
                    ] [] ]
      , div [ style "position" "absolute"
            , style "top" "52px"
            ] [ img [ src (case movement of
                            WASD ->
                              keyButtonTexture "a" keys
                            Arrows ->
                              keyButtonTexture "arrowLeft" keys
                          )
                    ] [] ]
      , div [ style "position" "absolute"
            , style "left" "52px"
            , style "top" "52px"
            ] [ img [ src (case movement of
                            WASD ->
                              keyButtonTexture "s" keys
                            Arrows ->
                              keyButtonTexture "arrowDown" keys
                          )
                    ] [] ]
      , div [ style "position" "absolute"
            , style "left" "104px"
            , style "top" "52px"
            ] [ img [ src (case movement of
                            WASD ->
                              keyButtonTexture "d" keys
                            Arrows ->
                              keyButtonTexture "arrowRight" keys
                          )
                    ] [] ]
      , div [ style "position" "absolute"
            , style "left" "260px"
            , style "top" "52px"
            ] [ img [ src (keyButtonTexture "spacebar" keys) ] [] ]
      ]

viewPlayerDebugInfo : Int -> Int -> String -> DecodingJson.Difficulty -> Player -> Html Msg
viewPlayerDebugInfo left top name diff player =
  pre [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ text ("name: " ++ name)
      , text ("\ndifficulty: " ++ DecodingJson.difficultyToString diff)
      --, text ("\nlvl: " ++ String.fromInt player.playerLevel)
      --, text ("\nmaxEXP: " ++ String.fromInt player.maxExp)
      --, text ("\ncurEXP: " ++ String.fromInt player.currentExp)
      , text ("\nx: " ++ String.fromFloat player.x)
      , text ("\ny: " ++ String.fromFloat player.y)
      , text ("\nvx: " ++ String.fromFloat player.vx)
      , text ("\nvy: " ++ String.fromFloat player.vy)
      , text ("\ncurrentSpeed: " ++ String.fromFloat player.currentSpeed)
      , text ("\nsword: " ++ Sword.swordTypeToString player.sword)
      , text ("\narmor: " ++ Armor.armorTypeToString player.armor)
      --, text ("\nmaxDEF: " ++ String.fromInt player.maxDefense)
      --, text ("\ncurDEF: " ++ String.fromInt player.armor.totalDef)
      --, text ("\nmaxHP: " ++ String.fromInt player.maxHealth)
      --, text ("\ncurHP: " ++ String.fromInt player.currentHealth)
      --, text ("\nHP potions: " ++ String.fromInt player.healthPotionCount)
      --, text ("\nSPD potions: " ++ String.fromInt player.speedPotionCount)
      ]

viewPlayerInfo : Int -> Int -> String -> Player -> Html Msg
viewPlayerInfo left top playerName player =
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ pre [ style "position" "absolute"
            , style "margin" "0em"
            , style "font-family" "monospace"
            , style "font-weight" "bolder"
            , style "font-size" "1.75em"
            ]
            [ text  playerName ]
      , pre [ style "position" "absolute"
            , style "margin-top" "1.5em"
            , style "font-size" "1.5em"
            ]
            [ text ("LVL: " ++ String.fromInt player.playerLevel)
            , text ("\nEXP: " ++ String.fromInt player.currentExp ++ " / " ++ String.fromInt player.maxExp)
            , text ("\n\nHealth: " ++ String.fromInt player.currentHealth ++ " / " ++ String.fromInt player.maxHealth)
            , text ("\nDefense: " ++ String.fromInt player.armor.totalDef ++ " / " ++ String.fromInt player.maxDefense)
            , text ("\nAttack: " ++ String.fromInt player.sword.attack)
            , text ("\nSpeed: " ++ String.fromFloat player.currentSpeed)
            ]
      ]

armorInfo : Int -> Int -> String -> Armor -> Armor.ArmorPiece -> Html Msg
armorInfo left top imgSize armor armorPiece =
  let
    armorImgPath =
      case armor.armorType of
        Armor.None ->
          "assets/item/default_" ++ armorPieceToString armorPiece ++ "_" ++ imgSize ++ "_" ++ imgSize ++ ".png"

        Armor.Leather ->
          "assets/item/leather_" ++ armorPieceToString armorPiece ++ "_" ++ imgSize ++ "_" ++ imgSize ++ ".png"

        Armor.Silver ->
          "assets/item/silver_" ++ armorPieceToString armorPiece ++ "_" ++ imgSize ++ "_" ++ imgSize ++ ".png"

        Armor.Dragon ->
          "assets/item/dragon_" ++ armorPieceToString armorPiece ++ "_" ++ imgSize ++ "_" ++ imgSize ++ ".png"
    armorPieceDefValue =
      case armorPiece of
        Armor.Helmet ->
          armor.helmetDef

        Armor.Chestplate ->
          armor.chestDef

        Armor.Legs ->
          armor.legsDef
    armorName = String.toUpper ((Armor.armorTypeToString armor) ++ " " ++ armorPieceToString armorPiece)
  in
  div [ style "position" "absolute"
      , style "top" (String.fromInt top ++ "px")
      ]
      [ pre [ style "position" "absolute"
            , style "left" (String.fromInt 150 ++ "px")
            , style "margin-top" "0em"
            , style "font-family" "consolas"
            , style "font-size" "1.5em"
            , style "font-weight" "bolder"
            ]
            [ text ((String.padLeft 15 ' ' armorName) ++ "\n") ]
      , pre [ style "position" "absolute"
            , style "left" (String.fromInt 150 ++ "px")
            , style "font-family" "consolas"
            , style "font-size" "1.5em"
            ]
            [ text (String.padLeft 15 ' ' ("DEF " ++ String.fromInt armorPieceDefValue )) ]
      , div [ style "position" "absolute"
            , style "left" (String.fromInt left ++ "px")
            ]
            [ img [ src armorImgPath ] [] ]
  ]

swordInfo : Int -> Int -> String -> Sword -> Html Msg
swordInfo left top imgSize sword =
  let
    swordImgPath =
      case sword.swordType of
        Sword.Wood ->
          "assets/sword/sword_wood_" ++ imgSize ++ "_" ++ imgSize ++ ".png"

        Sword.Stone ->
          "assets/sword/sword_stone_" ++ imgSize ++ "_" ++ imgSize ++ ".png"

        Sword.Iron ->
          "assets/sword/sword_iron_" ++ imgSize ++ "_" ++ imgSize ++ ".png"

        Sword.Dragon ->
          "assets/sword/sword_dragon_" ++ imgSize ++ "_" ++ imgSize ++ ".png"
    swordName = String.toUpper ((Sword.swordTypeToString sword) ++ " sword")
  in
  div [ style "position" "absolute"
      , style "top" (String.fromInt top ++ "px")
      ]
      [ pre [ style "position" "absolute"
            , style "left" (String.fromInt 150 ++ "px")
            , style "margin-top" "0em"
            , style "font-family" "consolas"
            , style "font-size" "1.5em"
            , style "font-weight" "bolder"
            ]
            [ text ((String.padLeft 15 ' ' swordName) ++ "\n") ]
      , pre [ style "position" "absolute"
            , style "left" (String.fromInt 150 ++ "px")
            , style "font-family" "consolas"
            , style "font-size" "1.5em"
            ]
            [ text (String.padLeft 15 ' ' ("ATK " ++ String.fromInt sword.attack )) ]
      , div [ style "position" "absolute"
            , style "left" (String.fromInt left ++ "px")
            ] [ img [ src swordImgPath ] [] ]
      ]

healthPotionInfo : Int -> Int -> Potion -> Html Msg
healthPotionInfo left top healthPotion =
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ div [ style "position" "absolute"
            ]
            [ img [ src ("assets/item/health_potion_128_128.png") ] [] ]
      , pre [ style "position" "absolute"
            --, style "margin-top" "0em"
            , style "margin-left" "4em"
            , style "font-family" "consolas"
            , style "font-size" "1.5em"
            , style "font-weight" "bolder"
            , style "color" "red"
            ]
            [ text ("Health potion  x" ++ String.fromInt healthPotion.count) ]
      , pre [ style "position" "absolute"
            , style "margin-top" "2.5em"
            , style "margin-left" "5em"
            , style "font-family" "monospace"
            , style "font-size" "1.5em"
            ]
            [ text ("- restores " ++ String.fromFloat (healthPotion.ratio * 100.0) ++ "% of max HP") ]
      ]

speedPotionInfo : Int -> Int -> Potion -> Html Msg
speedPotionInfo left top speedPotion =
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ div [ style "position" "absolute"
            ]
            [ img [ src ("assets/item/speed_potion_128_128.png") ] [] ]
      , pre [ style "position" "absolute"
            --, style "margin-top" "0em"
            , style "margin-left" "4em"
            , style "font-family" "consolas"
            , style "font-size" "1.5em"
            , style "font-weight" "bolder"
            , style "color" "green"
            ]
            [ text ("Speed potion  x" ++ String.fromInt speedPotion.count) ]
      , pre [ style "position" "absolute"
            , style "margin-top" "2.5em"
            , style "margin-left" "5em"
            , style "font-family" "monospace"
            , style "font-size" "1.5em"
            ]
            [ text ("- increase speed by " ++ String.fromFloat ((speedPotion.ratio - 1) * 100.0) ++ "%\n")
            , text ("- duration: " ++ String.fromFloat speedPotion.duration ++ "s")
            ]
      ]

viewCharacterScreen : Int -> Int -> List Keyboard.Key -> String -> Player -> Html Msg
viewCharacterScreen left top keys name player =
  let
    itemsImgSize = "64" --"128"
    characterImgPath =
      case player.armor.armorType of
        Armor.None ->
          "assets/player/player_EEE_256_512.png"

        Armor.Leather ->
          "assets/player/player_LLL_256_512.png"

        Armor.Silver ->
          "assets/player/player_SSS_256_512.png"

        Armor.Dragon ->
          "assets/player/player_DDD_256_512.png"

  in
  if List.member (Keyboard.Character "C") keys then
    div [ style "left" (String.fromInt left ++ "px")
        , style "top" (String.fromInt top ++ "px")
        , style "position" "absolute"
        , style "font-family" "monospace"
        ]
        [ img [ src "assets/character_screen_scroll_background_1200_600.png"
              , style "position" "absolute"
              ] []
        , div [ style "position" "absolute"
              , style "left" "472px"
              , style "top" "48px"
              ] [ img [ src characterImgPath ] [] ]
        , armorInfo 375 100 itemsImgSize player.armor Armor.Helmet
        , armorInfo 375 196 itemsImgSize player.armor Armor.Chestplate
        , armorInfo 375 292 itemsImgSize player.armor Armor.Legs
        , swordInfo 375 388 itemsImgSize player.sword
        , viewPlayerInfo 766 75 name player
        , healthPotionInfo 710 310 player.healthPotions
        , speedPotionInfo 710 420 player.speedPotions
        ]
  else
    div [] []

viewPauseScreen : Int -> Int -> String -> String -> String -> String -> Bool -> Player -> Html Msg
viewPauseScreen left top pathResume pathSettings pathHelp pathReturn pauseToggle player =
  if pauseToggle && player.currentHealth > 0 then
    div [ style "left" (String.fromInt left ++ "px")
        , style "top" (String.fromInt top ++ "px")
        , style "position" "absolute"
        , style "font-family" "monospace"
        ]
        [ img [ src "assets/background_1200_600.png"
              , style "position" "absolute"
              ] []
        , pre [ style "position" "absolute"
              , style "left" "500px"
              , style "top" "25px"
              , style "font-family" "Consolas"
              , style "font-weight" "bolder"
              , style "font-size" "1.75em"
              ]
              [ text "PAUSE SCREEN" ]
        , div [ style "position" "absolute"
              , style "left" "392px"
              , style "top" "150px"
              ]
              [ img [ src pathResume
                    , onMouseOver (Hover PauseScreenResume)
                    , onMouseOut (MouseOut PauseScreenResume)
                    , onClick ClickResume
                    , style "cursor" "pointer"
                    ] []
              ]
        , div [ style "position" "absolute"
              , style "left" "392px"
              , style "top" "250px"
              ]
              [ a [ Route.href Route.Settings ]
                  [ img [ src pathSettings
                        , onMouseOver (Hover PauseScreenSettings)
                        , onMouseOut (MouseOut PauseScreenSettings)
                        ] []
                  ]
              ]
        , div [ style "position" "absolute"
              , style "left" "392px"
              , style "top" "350px"
              ]
              [ a [ Route.href Route.Help ]
                  [ img [ src pathHelp
                        , onMouseOver (Hover PauseScreenHelp)
                        , onMouseOut (MouseOut PauseScreenHelp)
                        ] []
                  ]
              ]
        , div [ style "position" "absolute"
              , style "left" "392px"
              , style "top" "450px"
              ]
              [ a [ Route.href Route.Home ]
                  [ img [ src pathReturn
                        , onMouseOver (Hover PauseScreenReturn)
                        , onMouseOut (MouseOut PauseScreenReturn)
                        --, onClick SaveGame
                        ] []
                  ]
              ]
        ]
  else
    div [] []

viewDeathScreen : Int -> Int -> String -> String -> Player -> SavePosition -> Html Msg
viewDeathScreen left top pathRespawn pathReturn player pos =
  if player.currentHealth == 0 then
    div [ style "left" (String.fromInt left ++ "px")
        , style "top" (String.fromInt top ++ "px")
        , style "position" "absolute"
        , style "font-family" "monospace"
        ]
        [ img [ src "assets/death_screen_background_1200_600.png"
              , style "position" "absolute"
              ] []
        , div [ style "position" "absolute"
              , style "left" "390px"
              , style "top" "300px"
              ]
              [ a [ case pos of
                      First ->
                        Route.href Route.Game1

                      Second ->
                        Route.href Route.Game2

                      Third ->
                        Route.href Route.Game3
                  ]
                [ img [ src pathRespawn
                      , onMouseOver (Hover DeathScreenRespawn)
                      , onMouseOut (MouseOut DeathScreenRespawn)
                      ] []
                ]
              ]
        , div [ style "position" "absolute"
              , style "left" "390px"
              , style "top" "400px"
              ]
              [ a [ Route.href Route.Home ]
                [ img [ src pathReturn
                      , onMouseOver (Hover DeathScreenReturn)
                      , onMouseOut (MouseOut DeathScreenReturn)
                      ] []
                ]
              ]
        ]
  else
    div [] []

viewTime : Int -> Int -> Float -> Html Msg
viewTime left top dt =
  let
    minutes = floor (dt / 60)
    seconds = remainderBy 60 (floor dt) --floor dt
  in
  pre [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      , style "font-size" "x-large"
      , style "font-weight" "bold"
      ]
      [ text ((String.fromInt minutes) ++ " : " ++ (String.fromInt seconds)) ]

view : Model -> Html Msg--{ title : String, content : Html Msg }
view model =
  div [ style "font-family" "monospace" ]
      [ img [ src "assets/default_background_1920_969.png"
            , style "display" "block"
            , style "position" "relative"
            , style "left" "0px"
            , style "top" "0px"
            ] []
      , Game2d.renderWithOptions
          [ style "position" "absolute"
          , style "left" "320px"--"448px"
          , style "top" "100px" --"228px"
          , style "border" "solid 1px #FFF"
          ]
            { camera = model.camera
            , time = model.time
            , size = model.screen  -- (1280, 720)
            }
              (render model)
      , viewPlayerDebugInfo 100 100 model.name model.difficulty model.player
      , viewTime 950 50 model.time
      , viewDefenseBar 448 685 model.player.maxDefense model.player.armor.totalDef
      , viewHealthBar 448 725 model.player.maxHealth model.player.currentHealth
      , viewExpBar 448 765 model.player.maxExp model.player.currentExp
      , viewConsumable1 336 650 model.keys model.time model.player.healthPotions
      , viewConsumable2 1485 650 model.keys model.time model.player.speedPotions
      , viewCharacterScreen 360 160 model.keys model.name model.player
      , viewPauseScreen 360 160 model.button_PS_resume model.button_PS_settings model.button_PS_help model.button_PS_return model.pauseToggle model.player
      , viewDeathScreen 360 160 model.button_DS_respawn model.button_DS_return model.player model.savePosition
      , viewPlayerInput 820 835 model.keys model.movement  --820 861
      ]


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ Sub.map Keys Keyboard.subscriptions
    , onAnimationFrameDelta ((\dt -> dt / 1000) >> Tick)
    , Ports.reloadPage Reload
    ]
