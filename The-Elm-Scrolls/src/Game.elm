module Game exposing  (..)

import Browser
import Browser.Navigation as Nav
import Browser.Events exposing (onAnimationFrameDelta)
import Game.Resources as Resources exposing (..)
import Game.TwoD as Game2d
import Game.TwoD.Camera as Camera exposing (..)
import Game.TwoD.Render as Render exposing (..)
import Html exposing (Html, div, img, text, pre, p, span)
import Html.Attributes exposing (style, src)
import Html.Events exposing (on, keyCode)
import Json.Decode as D
import Keyboard exposing (..)
import Keyboard.Arrows
import Task
import Array

import Tilemap exposing (..)
import Level exposing (..)
import Player exposing (..)
import Sword exposing (..)
import Enemy exposing (..)
import Item exposing (..)
import Armor exposing (..)
import Potion exposing (..)

-- MODEL


type alias Model =
  { navKey : Nav.Key
  , level :  Level.Level
  , player : Player
  , resources : Resources
  , keys : List Keyboard.Key
  , time : Float
  , screen : ( Int, Int )
  , camera : Camera
  , pauseToggle : Bool
  }

type alias Input =
  { x : Int, y : Int }

type Msg
  = Tick Float
  | Resources Resources.Msg
  | Keys Keyboard.Msg

getNavKey : Model -> Nav.Key
getNavKey model =
  model.navKey

initPlayer : Level.Level -> Player
initPlayer level =
  { x = level.startX --56
  , y = level.startY --9
  , vx = 0
  , vy = 0
  , baseSpeed = 3.0
  , currentSpeed = 3.0
  , width = 1
  , height = 2
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

init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
  ( { navKey = navKey
    , level = Level.level2
    , player = initPlayer Level.level2
    , resources = Resources.init
    , keys = []
    , time = 0
    , screen = ( 1280, 720 )
    , camera = Camera.fixedArea (32 * 16) ( 0, 0 ) --(16 * 8) ( 0, 0 )
    , pauseToggle = False
    }
  , Cmd.map Resources ( Resources.loadTextures texturesList )
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
          | player = playerTick dt model.time model.level model.keys enemies playerWithExp
          , level =  levelTick dt model.pauseToggle model.player model.level --enemies model.level.items
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
            if List.member Keyboard.Escape keys then
              not model.pauseToggle
            else
              model.pauseToggle
        }
      , Cmd.none
      )


playerTick :
  Float
  -> Float
  -> Level
  -> List Keyboard.Key
  -> List Enemy
  -> Player
  -> Player
playerTick dt time lvl keys enemyList player =
  let
    moveInput =
      Keyboard.Arrows.wasd keys
      --Keyboard.Arrows.arrows keys
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
keyButtonTexture key_button keys =
  let
    assetPath = "assets/button/" ++ key_button ++ "_48_48.png"
    pressedPath = String.replace "." "_pressed." assetPath
  in
  if key_button == "spacebar" then
    if List.member (Keyboard.Spacebar) keys then
      "assets/button/spacebar_192_48_pressed.png"
    else
      "assets/button/spacebar_192_48.png"
  else if key_button == "q" then
    if List.member (Keyboard.Character "Q") keys then
      "assets/button/consumable_key_pressed.png"--pressedPath
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


-- VIEW


render : Model -> List Renderable
render ({ resources, camera } as model) =
  List.concat
    [ renderBackground resources
    , [ Player.renderPlayer resources model.player
      , renderSword resources model.player.sword model.keys
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

viewPlayerInput : Int -> Int -> List Keyboard.Key -> Html Msg
viewPlayerInput left top keys =
  div [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ div [ style "position" "absolute"
            , style "left" "52px"
            ] [ img [ src (keyButtonTexture "w" keys) ] [] ]
      , div [ style "position" "absolute"
            --, style "left" "34px"
            , style "top" "52px"
            ] [ img [ src (keyButtonTexture "a" keys) ] [] ]
      , div [ style "position" "absolute"
            , style "left" "52px"
            , style "top" "52px"
            ] [ img [ src (keyButtonTexture "s" keys) ] [] ]
      , div [ style "position" "absolute"
            , style "left" "104px"
            , style "top" "52px"
            ] [ img [ src (keyButtonTexture "d" keys) ] [] ]
      , div [ style "position" "absolute"
            , style "left" "260px"
            , style "top" "52px"
            ] [ img [ src (keyButtonTexture "spacebar" keys) ] [] ]
      ]

viewPlayerDebugInfo : Int -> Int -> Player -> Maybe Enemy -> Html Msg
viewPlayerDebugInfo left top player enemy =
  pre [ style "position" "absolute"
      , style "left" (String.fromInt left ++ "px")
      , style "top" (String.fromInt top ++ "px")
      ]
      [ text "Player"
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
      {-, text ("\neX: " ++ case enemy of
          Just en ->
            String.fromFloat en.x

          Nothing ->
            ""
            )
      , text ("\neY: " ++ case enemy of
          Just en ->
            String.fromFloat en.y

          Nothing ->
            ""
            )
      , text ("\neVX: " ++ case enemy of
          Just en ->
            String.fromFloat en.vx

          Nothing ->
            ""
            )
      , text ("\neVY: " ++ case enemy of
          Just en ->
            String.fromFloat en.vy

          Nothing ->
            ""
            )
      -}
      ]

viewPlayerInfo : Int -> Int -> Player -> Html Msg
viewPlayerInfo left top player =
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
            [ text  "<player_name>" ]
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

viewCharacterScreen : Int -> Int -> List Keyboard.Key -> Player -> Html Msg
viewCharacterScreen left top keys player =
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
        , viewPlayerInfo 766 75 player
        , healthPotionInfo 710 310 player.healthPotions
        , speedPotionInfo 710 420 player.speedPotions
        ]
  else
    div [] []

viewPauseScreen : Int -> Int -> Bool -> Html Msg
viewPauseScreen left top pauseToggle =
  if pauseToggle then
    div [ style "left" (String.fromInt left ++ "px")
        , style "top" (String.fromInt top ++ "px")
        , style "position" "absolute"
        , style "font-family" "monospace"
        ]
        [ img [ src "assets/background_1200_600.png"
              , style "position" "absolute"
              ] []
        , pre [ style "position" "absolute"
              , style "left" "472px"
              , style "top" "48px"
              , style "font-family" "Consolas"
              , style "font-weight" "bolder"
              , style "font-size" "1.75em"
              ]
              [ text "PAUSE SCREEN\n\n"
              , text "Resume\n"
              , text "Settings\n"
              , text "Controls\n"
              , text "Help\n"
              , text "Return to Main Menu\n"
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

view : Model -> { title : String, content : Html Msg }
view model =
  { title = "Game"
  , content =
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
      , viewPlayerDebugInfo 100 100 model.player (List.head model.level.enemies)
      , viewTime 950 50 model.time
      , viewDefenseBar 448 685 model.player.maxDefense model.player.armor.totalDef
      , viewHealthBar 448 725 model.player.maxHealth model.player.currentHealth
      , viewExpBar 448 765 model.player.maxExp model.player.currentExp
      , viewConsumable1 336 650 model.keys model.time model.player.healthPotions
      , viewConsumable2 1485 650 model.keys model.time model.player.speedPotions
      , viewCharacterScreen 360 160 model.keys model.player
      , viewPauseScreen 360 160 model.pauseToggle
      , viewPlayerInput 820 835 model.keys  --820 861
      ]
  }


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ Sub.map Keys Keyboard.subscriptions
    , onAnimationFrameDelta ((\dt -> dt / 1000) >> Tick)
    ]
