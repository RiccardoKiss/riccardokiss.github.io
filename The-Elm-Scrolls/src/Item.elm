module Item exposing (..)

import Game.TwoD.Render as Render exposing (..)
import Game.Resources as Resources exposing (..)

type alias Item =
  { x : Float
  , y : Float
  , width : Float
  , height : Float
  , itemType : ItemType
  , pickable : Bool
  }

type ItemType
  = ItemStand
  | HealthPotion_ItemStand
  | SpeedPotion_ItemStand
  | WoodSword_ItemStand
  | StoneSword_ItemStand
  | IronSword_ItemStand
  | DarkSword_ItemStand

textures : List String
textures =
  [ "assets/item/item_stand.png"
  , "assets/item/item_stand_health_potion_idle.png"
  , "assets/item/item_stand_speed_potion_idle.png"
  , "assets/item/item_stand_sword_wood_idle.png"
  , "assets/item/item_stand_sword_stone_idle.png"
  , "assets/item/item_stand_sword_iron_idle.png"
  , "assets/item/item_stand_sword_dark_idle.png"
  ]
