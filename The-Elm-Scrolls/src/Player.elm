module Player exposing (..)

import Game.TwoD.Render as Render exposing (..)
import Game.Resources as Resources exposing (..)
import Keyboard

import Sword exposing (..)
import Armor exposing (..)
import Potion exposing (..)


type alias Player =
  { x : Float
  , y : Float
  , vx : Float
  , vy : Float
  , baseSpeed : Float
  , currentSpeed : Float
  , width : Float
  , height : Float
  , dir : Direction
  , sword : Sword
  , armor : Armor
  , maxDefense : Int
  --, currentDefense : Int
  , maxHealth : Int
  , currentHealth : Int
  , playerLevel : Int
  , maxExp : Int
  , currentExp : Int
  , healthPotions : Potion
  , speedPotions : Potion
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
  , "assets/player/player_LLL_idle.png"
  , "assets/player/player_LLL_right.png"
  , "assets/player/player_LLL_left.png"
  , "assets/player/player_LLL_up.png"
  , "assets/player/player_LLL_down.png"
  , "assets/player/player_SSS_idle.png"
  , "assets/player/player_SSS_right.png"
  , "assets/player/player_SSS_left.png"
  , "assets/player/player_SSS_up.png"
  , "assets/player/player_SSS_down.png"
  , "assets/player/player_DDD_idle.png"
  , "assets/player/player_DDD_right.png"
  , "assets/player/player_DDD_left.png"
  , "assets/player/player_DDD_up.png"
  , "assets/player/player_DDD_down.png"
  ]

armorToTexturePath : Armor -> String
armorToTexturePath armor =
  case armor.armorType of
    Armor.None ->
      "EEE"

    Armor.Leather ->
      "LLL"

    Armor.Silver ->
      "SSS"

    Armor.Dragon ->
      "DDD"

playerDirToString : Player -> String
playerDirToString player =
  case player.dir of
    Left ->
      "left"

    Right ->
      "right"

    Up ->
      "up"

    Down ->
      "down"

    Idle ->
      "idle"

applyHealthPotion : List Keyboard.Key -> Float -> Player -> Player
applyHealthPotion keys time player =
  let
    healAmount = toFloat player.maxHealth * player.healthPotions.ratio
    newCurrHealth =
      if player.currentHealth + round healAmount < player.maxHealth then
        player.currentHealth + round healAmount
      else
        player.maxHealth
  in
  if player.healthPotions.count > 0 then
    if player.currentHealth < player.maxHealth then
      if Potion.canUsePotion time player.healthPotions then
        if List.member (Keyboard.Character "Q") keys then
          { player
            | currentHealth = newCurrHealth
            , healthPotions = Potion.decrementPotionsCount player.healthPotions
                              |> Potion.updateTimeOfLastUse time
          }
        else
          player
      else
        player
    else
      player
  else
    player

applySpeedPotion : List Keyboard.Key -> Float -> Player -> Player
applySpeedPotion keys time player =
  if Potion.canUsePotion time player.speedPotions then
    if player.speedPotions.count > 0 then
      if List.member (Keyboard.Character "E") keys then
        { player
          | currentSpeed = player.baseSpeed * player.speedPotions.ratio
          , speedPotions =
              Potion.decrementPotionsCount player.speedPotions
              |> Potion.updateTimeOfLastUse time
        }
      else
        { player | currentSpeed = player.baseSpeed }
    else
      { player | currentSpeed = player.baseSpeed }
  else
    player


walk : { x : Int, y : Int } -> Player -> Player
walk { x, y } player =
  { player
    | vx = player.currentSpeed * toFloat x
    , vy = player.currentSpeed * toFloat y
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

swordPhysics : List Keyboard.Key -> Player -> Player
swordPhysics keys player =
  let
    swordDir =
      case player.dir of
        Left ->
          Sword.Left

        Right ->
          Sword.Right

        Up ->
          Sword.Up

        Down ->
          Sword.Down

        Idle ->
          Sword.Idle
  in
  { player
    | sword = Sword.swordAttack player.sword keys
              |> Sword.updateSwordCoordinates swordDir player.x player.y
  }

renderPlayer : Resources -> Player -> Renderable
renderPlayer resources player =
  let
    playerImgPath =
      case player.dir of
        Left ->
          "assets/player/player_" ++ armorToTexturePath player.armor ++ "_left.png"

        Right ->
          "assets/player/player_" ++ armorToTexturePath player.armor ++ "_right.png"

        Up ->
          "assets/player/player_" ++ armorToTexturePath player.armor ++ "_up.png"

        Down ->
          "assets/player/player_" ++ armorToTexturePath player.armor ++ "_down.png"

        Idle ->
          "assets/player/player_" ++ armorToTexturePath player.armor ++ "_idle.png"
  in
  Render.animatedSpriteWithOptions
    { position = ( player.x, player.y, -0.1 )
    , size = ( player.width, player.height ) --( 1, 2 )
    , texture = Resources.getTexture playerImgPath resources
    , bottomLeft = ( 0, 0 )
    , topRight = ( 1, 1 )
    , duration = 1
    , numberOfFrames = 2
    , rotation = 0
    , pivot = ( 0, 0 )
    }
