module Main exposing (..)

import Url exposing (Url)
import Url.Parser as Parser exposing (Parser, (</>), parse, map, oneOf, top, s, string, int)
import Browser exposing (Document)
import Browser.Navigation as Nav
import Json.Decode as Decode
import Route exposing (Route)
import Debug exposing (..)
import Page
import Home
import Settings
import Help
import HighScores
import NotFound

import Url.Builder
import Browser.Events exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)

-- https://github.com/elm/package.elm-lang.org/blob/master/src/frontend/Main.elm
-- https://package.elm-lang.org/packages/elm/url/latest/Url-Builder
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


type Model
  = Home Home.Model
  | NotFound Nav.Key
  --| NewGame NewGame.Model
  --| LoadGame LoadGame.Model
  | Settings Settings.Model
  | HighScores HighScores.Model
  | Help Help.Model


init : Decode.Value -> Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url navKey =
  let
    _ = Debug.log "[init] url" url
  in
    changeRouteTo (Route.toRoute (Url.toString url)) (NotFound navKey)


changeRouteTo : Route -> Model -> ( Model, Cmd Msg )
changeRouteTo route model =
  let
    navKey =
      getNavKey model
    _ = Debug.log "[changeRouteTo] route" route
  in
  case route of
    Route.NotFound ->
      ( NotFound navKey, Cmd.none )

    Route.Home ->
      Home.init navKey
        |> Debug.log "  [changeRouteTo] Home"
        |> updateWith Home GotHomeMsg model

    Route.Settings ->
      Settings.init navKey
        |> Debug.log "  [changeRouteTo] Settings"
        |> updateWith Settings GotSettingsMsg model

    Route.Help ->
      Help.init navKey
        |> Debug.log "  [changeRouteTo] Help"
        |> updateWith Help GotHelpMsg model

    Route.HighScores ->
      HighScores.init navKey
        |> Debug.log "  [changeRouteTo] Help"
        |> updateWith HighScores GotHighScoresMsg model


updateWith : (subModel -> Model) -> (subMsg -> Msg) -> Model -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg )
updateWith toModel toMsg model ( subModel, subCmd ) =
  ( toModel subModel
  , Cmd.map toMsg subCmd
  )


-- UPDATE


type Msg
  = LinkClicked Browser.UrlRequest
  | UrlChanged Url.Url
  | GotHomeMsg Home.Msg
--  | GotNewGameMsg
--  | GotLoadGameMsg
  | GotSettingsMsg Settings.Msg
  | GotHelpMsg Help.Msg
  | GotHighScoresMsg HighScores.Msg
--  | GotPageNotFoundMsg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case ( msg, model ) of
    ( LinkClicked urlRequest, _ ) ->
      case urlRequest of
        Browser.Internal url ->   -- https://github.com/rtfeldman/elm-spa-example/blob/cb32acd73c3d346d0064e7923049867d8ce67193/src/Main.elm#L213
          ( model
          , Nav.pushUrl (getNavKey model) (Url.toString url)
          )

        Browser.External href ->
          ( model
          , Nav.load href
          )

    ( UrlChanged url, _ ) ->
      --( { model | url = url }, Cmd.none )
      changeRouteTo (Route.toRoute (Url.toString url)) model

    ( GotHomeMsg subMsg, Home modelHome ) ->
      Home.update subMsg modelHome
        |> updateWith Home GotHomeMsg model

    ( GotSettingsMsg subMsg, Settings modelSettings ) ->
      Settings.update subMsg modelSettings
        |> updateWith Settings GotSettingsMsg model

    ( GotHelpMsg subMsg, Help modelHelp ) ->
      Help.update subMsg modelHelp
        |> updateWith Help GotHelpMsg model

    ( GotHighScoresMsg subMsg, HighScores modelHighScores ) ->
      HighScores.update subMsg modelHighScores
        |> updateWith HighScores GotHighScoresMsg model

    ( _, _ ) ->
      ( model, Cmd.none )


getNavKey : Model -> Nav.Key
getNavKey model =
    case model of
        NotFound navKey ->
            navKey

        Home modelHome ->
            Home.getNavKey modelHome

        Settings modelSettings ->
          Settings.getNavKey modelSettings

        Help modelHelp ->
          Help.getNavKey modelHelp

        HighScores modelHighScores ->
          HighScores.getNavKey modelHighScores


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.none


-- VIEW


view : Model -> Document Msg
view model =
  let
    viewPage page toMsg content =
      let
        { title, body } =
          Page.view page content
      in
      { title = title
      , body = List.map (Html.map toMsg) body
      }
  in
  case model of
    NotFound _ ->
      Page.view Page.NotFound NotFound.view

    Home modelHome ->
      viewPage Page.Home GotHomeMsg (Home.view modelHome)

    Settings modelSettings ->
      viewPage Page.Settings GotSettingsMsg (Settings.view modelSettings)

    Help modelHelp ->
      viewPage Page.Help GotHelpMsg (Help.view modelHelp)

    HighScores modelHighScores ->
      viewPage Page.HighScores GotHighScoresMsg (HighScores.view modelHighScores)
