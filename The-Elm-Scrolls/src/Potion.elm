module Potion exposing (..)

type alias Potion =
  { ratio : Float
  , duration : Float
  , cooldown : Float
  , timeOfLastUse : Float
  , count : Int
  }

healthPotion : Float -> Float -> Float -> Float -> Int -> Potion
healthPotion rt dur cdr sec c =
  { ratio = rt
  , duration = dur
  , cooldown = cdr
  , timeOfLastUse = sec
  , count = c
  }

speedPotion : Float -> Float -> Float -> Float -> Int -> Potion
speedPotion rt dur cdr sec c =
  { ratio = rt
  , duration = dur
  , cooldown = cdr
  , timeOfLastUse = sec
  , count = c
  }

canUsePotion : Float -> Potion -> Bool
canUsePotion time potion =
  let
    secondsSinceLastUse = time - potion.timeOfLastUse
  in
  if secondsSinceLastUse >= potion.cooldown || potion.timeOfLastUse == 0.0 then
    True
  else
    False

incrementPotionsCount : Potion -> Potion
incrementPotionsCount potion =
  { potion
    | count = potion.count + 1
  }

decrementPotionsCount : Potion -> Potion
decrementPotionsCount potion =
  { potion
    | count = potion.count - 1
  }

updateTimeOfLastUse : Float -> Potion -> Potion
updateTimeOfLastUse time potion =
  { potion
    | timeOfLastUse = time
  }
