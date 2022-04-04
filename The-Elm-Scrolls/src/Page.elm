module Page exposing (Page(..), view)

import Browser exposing (Document)
import Html exposing (Html)


type Page
  = NotFound
  | Home
  | Settings
  | HighScores
  | Help
  | NewGame
  | LoadGame

view : Page -> { title : String, content : Html msg } -> Document msg
view page { title, content } =
  { title = title ++ " - The Elm Scrolls"
  , body = [ content ]
  }
