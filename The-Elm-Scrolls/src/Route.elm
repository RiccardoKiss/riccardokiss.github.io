module Route exposing (Route(..), parseUrl, pushUrl, href)

import Browser.Navigation as Nav
import Html exposing (Attribute)
import Html.Attributes as Attr
import Url exposing (Url)
import Url.Parser as Parser exposing (Parser, parse, map, oneOf, s)


type Route
  = Home
  | NewGame
  | Game
  | LoadGame
  | HighScores
  | Settings
  | Help
  | NotFound


-- PUBLIC


href : Route -> Attribute msg
href targetRoute =
  Attr.href (routeToString targetRoute)

pushUrl : Route -> Nav.Key -> Cmd msg
pushUrl route navKey =
  routeToString route
  |> Nav.pushUrl navKey

parseUrl : Url -> Route
parseUrl url =
  case parse matchRoute url of
    Just route ->
      route

    Nothing ->
      NotFound


-- INTERNAL


matchRoute : Parser (Route -> a) a
matchRoute =
  oneOf
    [ Parser.map Home (s "index.html")
    --, Parser.map Home Parser.top
    , Parser.map NewGame (s "new-game")
    , Parser.map Game (s "game")
    , Parser.map LoadGame (s "load-game")
    , Parser.map HighScores (s "highscores")
    , Parser.map Settings (s "settings")
    , Parser.map Help (s "help")
    ]

routeToString : Route -> String
routeToString route =
  case route of
    NotFound ->
      "not-found"

    Home ->
      "index.html"

    NewGame ->
      "new-game"

    Game ->
      "game"

    LoadGame ->
      "load-game"

    HighScores ->
      "highscores"

    Settings ->
      "settings"

    Help ->
      "help"
