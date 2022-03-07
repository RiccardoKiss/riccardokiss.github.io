module Player exposing (..)



type alias Player =
  { nick : String
  , level : Int
  , exp : Int
  , health : Int
  , attack : Int
  , defense : Int
  , speed : Float
  }

{-|
  Akcie, ktore bude hrac moct vykonavat.
  Resp. spravy, ktore dokaze generovat pre UPDATE.
-}
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
