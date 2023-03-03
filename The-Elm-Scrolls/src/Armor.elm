module Armor exposing (..)

type alias Armor =
  { armorType : ArmorType
  , totalDef : Int
  , helmetDef : Int
  , chestDef : Int
  , legsDef : Int
  }

type ArmorType
  = None
  | Leather
  | Silver
  --| Gold
  | Dragon

type ArmorPiece
  = Helmet
  | Chestplate
  | Legs

armorTypeToString : Armor -> String
armorTypeToString armor =
  case armor.armorType of
    None ->
      "none"

    Leather ->
      "leather"

    Silver ->
      "silver"

    Dragon ->
      "dragon"

armorPieceToString : ArmorPiece -> String
armorPieceToString armorPiece =
  case armorPiece of
    Helmet ->
      "helmet"

    Chestplate ->
      "chest"

    Legs ->
      "legs"

noneArmorSet : Armor
noneArmorSet =
  { armorType = None
  , totalDef = 2
  , helmetDef = 0
  , chestDef = 1
  , legsDef = 1
  }

leatherArmorSet : Armor
leatherArmorSet =
  { armorType = Leather
  , totalDef = 30
  , helmetDef = 10
  , chestDef = 10
  , legsDef = 10
  }

silverArmorSet : Armor
silverArmorSet =
  { armorType = Silver
  , totalDef = 60
  , helmetDef = 20
  , chestDef = 20
  , legsDef = 20
  }

dragonArmorSet : Armor
dragonArmorSet =
  { armorType = Dragon
  , totalDef = 90
  , helmetDef = 30
  , chestDef = 30
  , legsDef = 30
  }
