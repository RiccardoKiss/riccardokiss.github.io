module DecodingJson exposing (..)

import Json.Decode as D exposing (Decoder, int, float, bool, string, list)
import Json.Decode.Pipeline exposing (required, optional, hardcoded)

import Player exposing (Player, Direction)
import Sword exposing (..)
import Armor exposing (..)
import Potion exposing (Potion)
import Level exposing (Level)
import Enemy exposing (Enemy, Direction, EnemyType)
import Item exposing (Item, ItemType)
import Settings exposing (..)


type Difficulty
  = Easy
  | Medium
  | Hard

type alias Save =
  { name : Maybe String
  , difficulty : Difficulty
  , player : Maybe Player
  , time : Float
  , level : Maybe Level
  }

type alias Settings =
  { music : Music
  , movement : Movement
  }

type alias Flags =
  { save1 : Maybe Save
  , save2 : Maybe Save
  , save3 : Maybe Save
  , settings : Maybe Settings
  --, highscores :
  }

difficultyToString : Difficulty -> String
difficultyToString difficulty =
  case difficulty of
    Easy ->
      "easy"

    Medium ->
      "medium"

    Hard ->
      "hard"

flagsDecoder : Decoder Flags
flagsDecoder =
  D.map4 Flags
    (D.maybe (D.field "save1" saveDecoder))
    (D.maybe (D.field "save2" saveDecoder))
    (D.maybe (D.field "save3" saveDecoder))
    (D.maybe (D.field "settings" settingsDecoder))

settingsDecoder : Decoder Settings
settingsDecoder =
  D.map2 Settings
    (D.field "music" musicDecoder)
    (D.field "movement" movementDecoder)

musicDecoder : Decoder Music
musicDecoder =
  D.string
    |> D.andThen
      (\string ->
          case string of
            "on" ->
              D.succeed On

            "off" ->
              D.succeed Off

            _ ->
              D.fail "Invalid Music"
      )

movementDecoder : Decoder Movement
movementDecoder =
  D.string
    |> D.andThen
      (\string ->
          case string of
            "wasd" ->
              D.succeed WASD

            "arrows" ->
              D.succeed Arrows

            _ ->
              D.fail "Invalid Movement"
      )


saveDecoder : Decoder Save
saveDecoder =
  D.map5 Save
    (D.maybe (D.field "name" D.string))
    ((D.field "difficulty" difficultyDecoder))
    (D.maybe (D.field "player" playerDecoder))
    ((D.field "time" D.float))
    (D.maybe (D.field "level" levelDecoder))
  {-
  D.succeed Save
  |> optional "name" D.string "PLAYER"
  |> required "difficulty"
      (D.string
        |> D.andThen
          (\string ->
            case string of
              "easy" ->
                D.succeed Easy

              "medium" ->
                D.succeed Medium

              "hard" ->
                D.succeed Hard

              _ ->
                D.fail "Invalid difficulty"
          )
      )
  |> required "player" playerDecoder
  |> required "time" D.float
  |> required "level" levelDecoder
-}

difficultyDecoder : Decoder Difficulty
difficultyDecoder =
  D.string
    |> D.andThen
      (\string ->
          case string of
            "easy" ->
              D.succeed Easy

            "medium" ->
              D.succeed Medium

            "hard" ->
              D.succeed Hard

            _ ->
              D.fail "Invalid Difficulty"
      )


playerDecoder : Decoder Player.Player
playerDecoder =
  D.succeed Player.Player
  |> required "x" D.float
  |> required "y" D.float
  |> hardcoded 0.0  -- vx
  |> hardcoded 0.0  -- vy
  |> required "baseSpeed" D.float
  |> required "currentSpeed" D.float
  |> hardcoded 1.0  -- width
  |> hardcoded 2.0  -- height
  |> hardcoded Player.Idle  -- direction
  |> required "sword"
      (D.string
        |> D.andThen
          (\string ->
            case string of
              "wood" ->
                D.succeed Sword.woodSword

              "stone" ->
                D.succeed Sword.stoneSword

              "iron" ->
                D.succeed Sword.ironSword

              "dragon" ->
                D.succeed Sword.dragonSword

              _ ->
                D.fail "Invalid Sword"
          )
      )
  |> required "armor"
      (D.string
        |> D.andThen
          (\string ->
            case string of
              "none" ->
                D.succeed Armor.noneArmorSet

              "leather" ->
                D.succeed Armor.leatherArmorSet

              "silver" ->
                D.succeed Armor.silverArmorSet

              "dragon" ->
                D.succeed Armor.dragonArmorSet

              _ ->
                D.fail "Invalid Armor"
          )
      )
  |> required "maxDefense" D.int
  |> required "maxHealth" D.int
  |> required "currentHealth" D.int
  |> required "playerLevel" D.int
  |> required "maxExp" D.int
  |> required "currentExp" D.int
  |> required "healthPotions" potionDecoder
  |> required "speedPotions" potionDecoder

potionDecoder : Decoder Potion.Potion
potionDecoder =
  D.map5 Potion.Potion
    (D.field "ratio" D.float)
    (D.field "duration" D.float)
    (D.field "cooldown" D.float)
    (D.field "timeOfLastUse" D.float)
    (D.field "count" D.int)

levelDecoder : Decoder Level.Level
levelDecoder =
  D.map8 Level.Level
    (D.field "map"
      (D.string
        |> D.andThen
          (\string ->
            case string of
              "LvL1" ->
                D.succeed Level.Lvl1

              "LvL2" ->
                D.succeed Level.Lvl2

              "LvL3" ->
                D.succeed Level.Lvl3

              _ ->
                D.fail "Invalid Map"
          )
      )
    )
    (D.field "mapTexture" D.string)
    (D.field "enemies" (D.list enemyDecoder))
    (D.field "items" (D.list itemDecoder))
    (D.field "startX" D.float)
    (D.field "startY" D.float)
    (D.field "endX" D.float)
    (D.field "endY" D.float)

enemyDecoder : Decoder Enemy.Enemy
enemyDecoder =
  D.succeed Enemy.Enemy
  |> required "initX" D.float
  |> required "initY" D.float
  |> required "initDir"
      (D.string
        |> D.andThen
          (\string ->
            case string of
              "left" ->
                D.succeed Enemy.Left

              "right" ->
                D.succeed Enemy.Right

              "up" ->
                D.succeed Enemy.Up

              "down" ->
                D.succeed Enemy.Down

              _ ->
                D.fail "Invalid Direction"
          )
      )
  |> required "x" D.float
  |> required "y" D.float
  |> required "vx" D.float
  |> required "vy" D.float
  |> required "dir"
      (D.string
        |> D.andThen
          (\string ->
            case string of
              "left" ->
                D.succeed Enemy.Left

              "right" ->
                D.succeed Enemy.Right

              "up" ->
                D.succeed Enemy.Up

              "down" ->
                D.succeed Enemy.Down

              _ ->
                D.fail "Invalid Direction"
          )
      )
  |> hardcoded 1.0  -- width
  |> hardcoded 2.0  -- height
  |> required "enemyType"
      (D.string
        |> D.andThen
          (\string ->
            case string of
              "bandit" ->
                D.succeed Enemy.Bandit

              "zombie" ->
                D.succeed Enemy.Zombie

              "skeleton" ->
                D.succeed Enemy.Skeleton

              "prototype" ->
                D.succeed Enemy.Prototype

              _ ->
                D.fail "Invalid EnemyType"
          )
      )
  |> required "distanceLoop" D.float
  |> required "speed" D.float
  |> required "attack" D.int
  |> required "health" D.int
  |> required "expDrop" D.int
  |> required "detectPlayerRadius" D.float
  |> required "hostile" D.bool
  |> required "alive" D.bool

itemDecoder : Decoder Item.Item
itemDecoder =
  D.map6 Item
    (D.field "x" D.float)
    (D.field "y" D.float)
    (D.field "width" D.float)
    (D.field "height" D.float)
    (D.field "itemType"
      (D.string
        |> D.andThen
          (\string ->
            case string of
              "empty" ->
                D.succeed Item.ItemStand

              "health_potion_idle" ->
                D.succeed Item.HealthPotion_ItemStand

              "speed_potion_idle" ->
                D.succeed Item.SpeedPotion_ItemStand

              "sword_wood_idle" ->
                D.succeed Item.WoodSword_ItemStand

              "sword_stone_idle" ->
                D.succeed Item.StoneSword_ItemStand

              "sword_iron_idle" ->
                D.succeed Item.IronSword_ItemStand

              "sword_dragon_idle" ->
                D.succeed Item.DragonSword_ItemStand

              "leather_chest" ->
                D.succeed Item.LeatherArmor_ItemStand

              "silver_chest" ->
                D.succeed Item.SilverArmor_ItemStand

              "dragon_chest" ->
                D.succeed Item.DragonArmor_ItemStand

              _ ->
                D.fail "Invalid ItemType"
          )
      )
    )
    (D.field "pickable" D.bool)

{-
emptySave : Save
emptySave =
  { name = Nothing
  , difficulty = Easy
  , player =
    { x = 56.0
    , y = 9.0
    , vx = 0.0
    , vy = 0.0
    , baseSpeed = 3.0
    , currentSpeed = 3.0
    , width = 1.0
    , height = 2.0
    , dir = Player.Idle
    , sword = Sword.woodSword
    , armor = Armor.noneArmorSet
    , maxDefense = 100
    , maxHealth = 100
    , currentHealth = 50
    , playerLevel = 1
    , maxExp = 5
    , currentExp = 0
    , healthPotions = Potion.healthPotion 0.1 0.0 3.0 0.0 0
    , speedPotions = Potion.speedPotion 1.5 5.0 5.0 0.0 0
    }
  , time = 0.0
  , level = Level.level2
  }
-}
