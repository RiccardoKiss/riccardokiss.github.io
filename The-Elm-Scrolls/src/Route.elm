module Route exposing (Route(..), parser, replaceUrl, fromUrl, routeToPieces, href, toRoute)


import Browser.Navigation as Nav
import Html exposing (Attribute)
import Html.Attributes as Attr
import Url exposing (Url)
--import Url.Parser as Parser exposing ((</>), Parser, oneOf, s, string)
import Url.Parser as Parser exposing (Parser, parse, int, map, oneOf, s, top)

type Route
  = Home
  | Settings
  --| Help
  --| HighScore
  --| NewGame
  --| LoadGame
  --| Game
  | NotFound


parser : Parser (Route -> a) a
parser =
  oneOf
    [ Parser.map Home Parser.top
    --, Parser.map Help (s "help")
    --, Parser.map HighScore (s "highscore")
    , Parser.map Settings (s "settings")
    --, Parser.map NewGame (s "new-game")
    --, Parser.map LoadGame (s "load-game")
    --, Parser.map Game (s "game")
    ]

toRoute : String -> Route
toRoute string =
    case Url.fromString string of
      Nothing ->
        NotFound

      Just url ->
        Maybe.withDefault NotFound (Parser.parse parser url)


-- PUBLIC

href : Route -> Attribute msg
href targetRoute =
  Attr.href (routeToPieces targetRoute)

replaceUrl : Nav.Key -> Route -> Cmd msg
replaceUrl key targetRoute =
  Nav.replaceUrl key (routeToPieces targetRoute)


fromUrl : Url -> Maybe Route
fromUrl url =
  { url | path = Maybe.withDefault "" url.fragment, fragment = Nothing }
    |> Parser.parse parser



-- INTERNAL

--routeToString : Route -> String
--routeToString page =
--  "#/" ++ String.join "/" (routeToPieces page)


routeToPieces : Route -> String
routeToPieces page =
  case page of
    NotFound ->
      "not-found"

    Home ->
      ""
    --Help ->
      --"help"

    --HighScore ->
      --"highscore"

    Settings ->
      "settings"

    --Game ->
      --"game"

    --NewGame ->
      --"new-game"

    --LoadGame ->
      --"load-game"
