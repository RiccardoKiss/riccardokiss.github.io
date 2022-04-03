module Route exposing (Route(..), parser, toRoute, href, routeToPieces)

import Browser.Navigation as Nav
import Html exposing (Attribute)
import Html.Attributes as Attr
import Url exposing (Url)
import Url.Parser as Parser exposing (Parser, parse, map, oneOf, s)


type Route
  = Home
  | Settings
  | Help
  | HighScores
  | NewGame
  --| LoadGame
  --| Game
  | NotFound


parser : Parser (Route -> a) a
parser =
  oneOf
    [ Parser.map Home (s "index.html")
    --, Parser.map Home Parser.top
    , Parser.map Help (s "help")
    , Parser.map HighScores (s "highscores")
    , Parser.map Settings (s "settings")
    , Parser.map NewGame (s "new-game")
    --, Parser.map LoadGame (s "load-game")
    --, Parser.map Game (s "game")
    ]

toRoute : String -> Route
toRoute string =
  let
    _ = Debug.log "[Route.toRoute] string" string
  in
  case Debug.log "  [Route.toRoute] Url.fromString string" (Url.fromString string) of
    Nothing ->
      NotFound

    Just url ->
      Maybe.withDefault NotFound (Parser.parse parser url)


-- PUBLIC

href : Route -> Attribute msg
href targetRoute =
  --let
    --_ = Debug.log "[Route.href] targetRoute" targetRoute
  --in
  Attr.href (routeToPieces targetRoute)

{-
replaceUrl : Nav.Key -> Route -> Cmd msg
replaceUrl key targetRoute =
  Nav.replaceUrl key (routeToPieces targetRoute)


fromUrl : Url -> Maybe Route
fromUrl url =
  let
    _ = Debug.log "[Route.fromUrl] url" url
  in
    { url | path = Maybe.withDefault "" url.fragment, fragment = Nothing }
      |> Debug.log "  path"
      |> Parser.parse parser
-}


-- INTERNAL

routeToPieces : Route -> String
routeToPieces page =
  --let
    --_ = Debug.log "[Route.routeToPieces] page" page
  --in
  case page of
    NotFound ->
      "not-found"

    Home ->
      "index.html"

    Help ->
      "help"

    HighScores ->
      "highscores"

    Settings ->
      "settings"

    --Game ->
      --"game"

    NewGame ->
      "new-game"

    --LoadGame ->
      --"load-game"
