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
  | DragonSword_ItemStand
  | LeatherArmor_ItemStand
  | SilverArmor_ItemStand
  | DragonArmor_ItemStand

textures : List String
textures =
  [ "assets/item/item_stand_empty.png"
  , "assets/item/item_stand_health_potion_idle.png"
  , "assets/item/item_stand_speed_potion_idle.png"
  , "assets/item/item_stand_sword_wood_idle.png"
  , "assets/item/item_stand_sword_stone_idle.png"
  , "assets/item/item_stand_sword_iron_idle.png"
  , "assets/item/item_stand_sword_dragon_idle.png"
  , "assets/item/item_stand_leather_chest.png"
  , "assets/item/item_stand_silver_chest.png"
  , "assets/item/item_stand_dragon_chest.png"
  ]

itemTypeToString : Item -> String
itemTypeToString item =
  case item.itemType of
    ItemStand ->
      "empty"

    HealthPotion_ItemStand ->
      "health_potion_idle"

    SpeedPotion_ItemStand ->
      "speed_potion_idle"

    WoodSword_ItemStand ->
      "sword_wood_idle"

    StoneSword_ItemStand ->
      "sword_stone_idle"

    IronSword_ItemStand ->
      "sword_iron_idle"

    DragonSword_ItemStand ->
      "sword_dragon_idle"

    LeatherArmor_ItemStand ->
      "leather_chest"

    SilverArmor_ItemStand ->
      "silver_chest"

    DragonArmor_ItemStand ->
      "dragon_chest"

getItemType : Item -> ItemType
getItemType item =
  item.itemType

updateItemStand : Int -> Int -> Item -> Item
updateItemStand x y item =
  if checkItemStandByCoordinates x y item && item.pickable then
    itemPickedUp item
  else item

itemPickedUp : Item -> Item
itemPickedUp item =
  if item.itemType /= ItemStand then
    { item
      | itemType = ItemStand
      , pickable = False
    }
  else item

isPickable : Item -> Bool
isPickable item =
  if item.pickable then True else False

checkItemStandByCoordinates : Int -> Int -> Item -> Bool
checkItemStandByCoordinates x y item =
  if item.x == ( toFloat x ) && item.y == ( toFloat y ) then True else False

itemStand : Float -> Float -> Item
itemStand x y =
  { x = x
  , y = y
  , width = 1
  , height = 2
  , itemType = ItemStand
  , pickable = False
  }

healthPotionStand : Float -> Float -> Item
healthPotionStand x y =
  { x = x
  , y = y
  , width = 1
  , height = 2
  , itemType = HealthPotion_ItemStand
  , pickable = True
  }

speedPotionStand : Float -> Float -> Item
speedPotionStand x y =
  { x = x
  , y = y
  , width = 1
  , height = 2
  , itemType = SpeedPotion_ItemStand
  , pickable = True
  }

woodSwordStand : Float -> Float -> Item
woodSwordStand x y =
  { x = x
  , y = y
  , width = 1
  , height = 2
  , itemType = WoodSword_ItemStand
  , pickable = True
  }

stoneSwordStand : Float -> Float -> Item
stoneSwordStand x y =
  { x = x
  , y = y
  , width = 1
  , height = 2
  , itemType = StoneSword_ItemStand
  , pickable = True
  }

ironSwordStand : Float -> Float -> Item
ironSwordStand x y =
  { x = x
  , y = y
  , width = 1
  , height = 2
  , itemType = IronSword_ItemStand
  , pickable = True
  }

dragonSwordStand : Float -> Float -> Item
dragonSwordStand x y =
  { x = x
  , y = y
  , width = 1
  , height = 2
  , itemType = DragonSword_ItemStand
  , pickable = True
  }

leatherArmorStand : Float -> Float -> Item
leatherArmorStand x y =
  { x = x
  , y = y
  , width = 1
  , height = 2
  , itemType = LeatherArmor_ItemStand
  , pickable = True
  }

silverArmorStand : Float -> Float -> Item
silverArmorStand x y =
  { x = x
  , y = y
  , width = 1
  , height = 2
  , itemType = SilverArmor_ItemStand
  , pickable = True
  }

dragonArmorStand : Float -> Float -> Item
dragonArmorStand x y =
  { x = x
  , y = y
  , width = 1
  , height = 2
  , itemType = DragonArmor_ItemStand
  , pickable = True
  }

renderItemStand : Resources -> Item -> Renderable
renderItemStand resources item =
  Render.animatedSpriteWithOptions
    { position = ( item.x, item.y, -0.1 )
    , size = ( 1, 2 )
    , texture = Resources.getTexture ("assets/item/item_stand_" ++ itemTypeToString item ++ ".png") resources
    , bottomLeft = ( 0, 0 )
    , topRight = ( 1, 1 )
    , duration = 1
    , numberOfFrames = 4
    , rotation = 0
    , pivot = ( 0, 0 )
    }
