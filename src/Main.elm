module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Url exposing (..)
import Browser exposing (Document)
import Browser.Navigation as Nav
import Json.Decode as Decode exposing (Decoder, decodeValue)
import Debug exposing (..)

import Route exposing (Route)
import DecodingJson exposing (..)
import Home
import NewGame
import Game
import LoadGame
import HighScores
import Settings
import Help


-- Credits:
-- https://github.com/elm/package.elm-lang.org/blob/master/src/frontend/Main.elm
-- https://package.elm-lang.org/packages/elm/browser/latest/Browser#application
-- https://guide.elm-lang.org/webapps/navigation.html
-- https://github.com/rtfeldman/elm-spa-example

-- MAIN


main : Program Decode.Value Model Msg
main =
  Browser.application
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    , onUrlChange = UrlChanged
    , onUrlRequest = LinkClicked
    }


-- MODEL


type alias Model =
  { pageModel : PageModel
  , route : Route
  , navKey : Nav.Key
  , flags : DecodingJson.Flags
  }

type PageModel
  = HomePage Home.Model
  | NotFoundPage --Nav.Key
  | NewGamePage NewGame.Model
  | GamePage Game.Model
  | LoadGamePage LoadGame.Model
  | HighScoresPage HighScores.Model
  | SettingsPage Settings.Model
  | HelpPage Help.Model


init : Decode.Value -> Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url navKey =
  let
    _ = Debug.log "[Main.init] url" url
    stringUrl = Url.toString url
    replacedUrl =
      if String.contains "/The-Elm-Scrolls/" stringUrl then
        String.replace "/The-Elm-Scrolls/" "/" stringUrl
      else
        stringUrl
    decodedFlags =
      case Decode.decodeValue flagsDecoder flags of
        Ok decoded -> decoded
        Err _ ->
          { save1 = Nothing
          , save2 = Nothing
          , save3 = Nothing
          , settings = Nothing
          , highScores = Nothing
          }
    _ = Debug.log "[Main.init] decodedFlags" decodedFlags
    model =
      { route =
          case Url.fromString replacedUrl of
            Just u ->
              Route.parseUrl u

            Nothing ->
              Route.parseUrl url
      , pageModel = NotFoundPage
      , navKey = navKey
      , flags = decodedFlags
      }
  in
  initPage ( model, Cmd.none )

initPage : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
initPage ( model, existingCmds ) =
  let
    ( currentPageModel, mappedPageCmds ) =
      case model.route of
        Route.NotFound ->
          ( NotFoundPage, Cmd.none )

        Route.Home ->
          let
            ( pageModel, pageCmds ) =
              Home.init model.navKey
          in
          ( HomePage pageModel, Cmd.map HomePageMsg pageCmds )

        Route.NewGame ->
          let
            ( pageModel, pageCmds ) =
              NewGame.init model.navKey
          in
          ( NewGamePage pageModel, Cmd.map NewGamePageMsg pageCmds )

        Route.Game1 ->
          let
            ( pageModel, pageCmds ) =
              Game.init model.flags.save1 Game.First model.flags.settings model.flags.highScores model.navKey
          in
          ( GamePage pageModel, Cmd.map GamePageMsg pageCmds )

        Route.Game2 ->
          let
            ( pageModel, pageCmds ) =
              Game.init model.flags.save2 Game.Second model.flags.settings model.flags.highScores model.navKey
          in
          ( GamePage pageModel, Cmd.map GamePageMsg pageCmds )

        Route.Game3 ->
          let
            ( pageModel, pageCmds ) =
              Game.init model.flags.save3 Game.Third model.flags.settings model.flags.highScores model.navKey
          in
          ( GamePage pageModel, Cmd.map GamePageMsg pageCmds )

        Route.LoadGame ->
          let
            ( pageModel, pageCmds ) =
              LoadGame.init model.flags model.navKey
          in
          ( LoadGamePage pageModel, Cmd.map LoadGamePageMsg pageCmds )

        Route.HighScores ->
          let
            ( pageModel, pageCmds ) =
              HighScores.init model.flags.highScores model.navKey
          in
          ( HighScoresPage pageModel, Cmd.map HighScoresPageMsg pageCmds )

        Route.Settings ->
          let
            ( pageModel, pageCmds ) =
              Settings.init model.navKey
          in
          ( SettingsPage pageModel, Cmd.map SettingsPageMsg pageCmds )

        Route.Help ->
          let
            ( pageModel, pageCmds ) =
              Help.init model.navKey
          in
          ( HelpPage pageModel, Cmd.map HelpPageMsg pageCmds )
  in
  ( { model | pageModel = currentPageModel }
  , Cmd.batch [ existingCmds, mappedPageCmds ]
  )


-- UPDATE


type Msg
  = LinkClicked Browser.UrlRequest
  | UrlChanged Url.Url
  | HomePageMsg Home.Msg
  | NewGamePageMsg NewGame.Msg
  | GamePageMsg Game.Msg
  | LoadGamePageMsg LoadGame.Msg
  | HighScoresPageMsg HighScores.Msg
  | SettingsPageMsg Settings.Msg
  | HelpPageMsg Help.Msg
--| NotFoundPageMsg

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case ( msg, model.pageModel ) of
    ( LinkClicked urlRequest, _ ) ->
      case urlRequest of
        Browser.Internal url ->
          ( model
          , Nav.pushUrl model.navKey ( Url.toString url )
          )

        Browser.External url ->
          ( model
          , Nav.load url
          )

    ( UrlChanged url, _ ) ->
      {-let
        stringUrl = Url.toString url
        replacedUrl =
          if String.contains "/The-Elm-Scrolls/" stringUrl then
            String.replace "/The-Elm-Scrolls/" "/" stringUrl
          else
            stringUrl
        newRoute =
          case Url.fromString replacedUrl of
            Just u ->
              Route.parseUrl u

            Nothing ->
              Route.parseUrl url
      in-}
      ( { model | route = newRoute }, Cmd.none )
      |> initPage

    ( HomePageMsg subMsg, HomePage modelHome ) ->
      let
        ( updatedPageModel, updatedCmds ) = Home.update subMsg modelHome
      in
      ( { model | pageModel = HomePage updatedPageModel }
      , Cmd.map HomePageMsg updatedCmds
      )

    ( NewGamePageMsg subMsg, NewGamePage modelNewGame ) ->
      let
        ( updatedPageModel, updatedCmds ) = NewGame.update subMsg modelNewGame
      in
      ( { model | pageModel = NewGamePage updatedPageModel }
      , Cmd.map NewGamePageMsg updatedCmds
      )

    ( GamePageMsg subMsg, GamePage modelGame ) ->
      let
        ( updatedPageModel, updatedCmds ) = Game.update subMsg modelGame
      in
      ( { model | pageModel = GamePage updatedPageModel }
      , Cmd.map GamePageMsg updatedCmds
      )

    ( LoadGamePageMsg subMsg, LoadGamePage modelLoadGame ) ->
      let
        ( updatedPageModel, updatedCmds ) = LoadGame.update subMsg modelLoadGame
      in
      ( { model | pageModel = LoadGamePage updatedPageModel }
      , Cmd.map LoadGamePageMsg updatedCmds
      )

    ( HighScoresPageMsg subMsg, HighScoresPage modelHighScores ) ->
      let
        ( updatedPageModel, updatedCmds ) = HighScores.update subMsg modelHighScores
      in
      ( { model | pageModel = HighScoresPage updatedPageModel }
      , Cmd.map HighScoresPageMsg updatedCmds
      )

    ( SettingsPageMsg subMsg, SettingsPage modelSettings ) ->
      let
        ( updatedPageModel, updatedCmds ) = Settings.update subMsg modelSettings
      in
      ( { model | pageModel = SettingsPage updatedPageModel }
      , Cmd.map SettingsPageMsg updatedCmds
      )

    ( HelpPageMsg subMsg, HelpPage modelHelp ) ->
      let
        ( updatedPageModel, updatedCmds ) = Help.update subMsg modelHelp
      in
      ( { model | pageModel = HelpPage updatedPageModel }
      , Cmd.map HelpPageMsg updatedCmds
      )

    ( _, _ ) ->
      ( model, Cmd.none )


-- VIEW

view : Model -> Document Msg
view model =
  { title = ( viewTitle model ) ++ " - The Elm Scrolls"
  , body =
      [ viewBody model
      , backgroundMusic model.flags.settings
      ]
  }

viewTitle : Model -> String
viewTitle model =
  case model.pageModel of
    NotFoundPage ->
      "Not Found"

    HomePage modelHome ->
      "Home"

    NewGamePage modelNewGame ->
      "New Game"

    GamePage modelGame ->
      "Game"

    LoadGamePage modelLoadGame ->
      "Load Game"

    HighScoresPage modelHighScores ->
      "HighScores"

    SettingsPage modelSettings ->
      "Settings"

    HelpPage modelHelp ->
      "Help"

viewBody : Model -> Html Msg
viewBody model =
  case model.pageModel of
    NotFoundPage ->
      h1 [] [ text "Oops! The page you requested was not found!" ]

    HomePage modelHome ->
      Home.view modelHome
      |> Html.map HomePageMsg

    NewGamePage modelNewGame ->
      NewGame.view modelNewGame
      |> Html.map NewGamePageMsg

    GamePage modelGame ->
      Game.view modelGame
      |> Html.map GamePageMsg

    LoadGamePage modelLoadGame ->
      LoadGame.view modelLoadGame
      |> Html.map LoadGamePageMsg

    HighScoresPage modelHighScores ->
      HighScores.view modelHighScores
      |> Html.map HighScoresPageMsg

    SettingsPage modelSettings ->
      Settings.view modelSettings
      |> Html.map SettingsPageMsg

    HelpPage modelHelp ->
      Help.view modelHelp
      |> Html.map HelpPageMsg

backgroundMusic : Maybe DecodingJson.Settings -> Html Msg
backgroundMusic settings =
  case settings of
    Just s ->
      case s.music of
        Settings.On ->
          audio [ src "assets/audio/music/CaveLoop.wav"
                , autoplay True
                , controls False
                , loop True
                ] []

        Settings.Off ->
          div [] []

    Nothing ->
      div [] []

-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  case model.pageModel of
    NotFoundPage ->
      Sub.none

    HomePage modelHome ->
      Sub.map HomePageMsg (Home.subscriptions modelHome)

    NewGamePage modelNewGame ->
      Sub.none

    GamePage modelGame ->
      Sub.map GamePageMsg (Game.subscriptions modelGame)

    LoadGamePage modelLoadGame ->
      Sub.map LoadGamePageMsg (LoadGame.subscriptions modelLoadGame)

    HighScoresPage modelHighScores ->
      Sub.none

    SettingsPage modelSettings ->
      Sub.none

    HelpPage modelHelp ->
      Sub.none
