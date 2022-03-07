module Armor exposing (..)

type alias Armor =
  { armor_type : Armor_Type
  , health_bonus : Int
  , defense_bonus : Int
  }

type Armor_Type
  = Head
  | Body
  | Arms
  | Legs
