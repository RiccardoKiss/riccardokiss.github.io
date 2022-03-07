module Enemy exposing (..)

type alias Enemy =
  { enemy_type : Enemy_Type
  , health : Int
  , attack : Int
  , defense : Int
  , exp_drop : Int
  , speed : Float
  , detect_player_radius : Float
  , alive : Bool
  }

type Enemy_Type
  = Bandit
  | Zombie
  | Skeleton
