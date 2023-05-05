module LoadGame exposing (..)

import Browser.Navigation as Nav
import Html exposing (Html, div, h1, a, text, img, pre)
import Html.Attributes exposing (src, style)
import Html.Events exposing (onClick, onMouseOver, onMouseOut)
import Round

import Route exposing (Route)
import Ports exposing (..)
import DecodingJson exposing (..)
import Level exposing (mapToString)


type alias Save =
  { name : String
  , difficulty : String
  , time : Float
  , level : Int
  , playerLevel : Int
  , playerHealth : Float
  }

type alias Model =
  { navKey : Nav.Key
  , buttonGame1 : String
  , buttonGame2 : String
  , buttonGame3 : String
  , buttonBack : String
  , save1 : Maybe DecodingJson.Save
  , save2 : Maybe DecodingJson.Save
  , save3 : Maybe DecodingJson.Save
  }


init : DecodingJson.Flags -> Nav.Key -> ( Model, Cmd Msg )
init flags navKey =
  ( { navKey = navKey
    , buttonGame1 = "assets/button/button_loadGameInstance_background.png"
    , buttonGame2 = "assets/button/button_loadGameInstance_background.png"
    , buttonGame3 = "assets/button/button_loadGameInstance_background.png"
    , buttonBack = "assets/button/button_back.png"
    , save1 = flags.save1
    , save2 = flags.save2
    , save3 = flags.save3
    }
  , Ports.loadedPage ()
  )


type Msg
  = HoverBack
  | HoverGame1
  | HoverGame2
  | HoverGame3
  --| ClickedBack
  | MouseOut
  | Reload Bool


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    HoverGame1 ->
      ( { model
        | buttonGame1 = "assets/button/button_loadGameInstance_background_hover.png"
        }
      , Cmd.none
      )

    HoverGame2 ->
      ( { model
        | buttonGame2 = "assets/button/button_loadGameInstance_background_hover.png"
        }
      , Cmd.none
      )

    HoverGame3 ->
      ( { model
        | buttonGame3 = "assets/button/button_loadGameInstance_background_hover.png"
        }
      , Cmd.none
      )

    HoverBack ->
      ( { model
        | buttonBack = "assets/button/button_back_hover.png"
        }
      , Cmd.none
      )

    MouseOut ->
      ( { model
        | buttonGame1 = "assets/button/button_loadGameInstance_background.png"
        , buttonGame2 = "assets/button/button_loadGameInstance_background.png"
        , buttonGame3 = "assets/button/button_loadGameInstance_background.png"
        , buttonBack = "assets/button/button_back.png"
        }
      , Cmd.none
      )

    Reload rel ->
      if rel then
        ( model, Nav.reload )
      else
        ( model, Cmd.none )


viewLoadGameInfo : Maybe DecodingJson.Save -> Html Msg
viewLoadGameInfo save =
  case save of
    Just s ->
      viewSavedGame s

    Nothing ->
      viewEmptyGame

viewSavedGame : DecodingJson.Save -> Html Msg
viewSavedGame save =
  let
    playerName =
      case save.name of
        Just name ->
          name

        Nothing ->
          "PLAYER"

    gameLvl =
      case save.level of
        Just level ->
          Level.mapToString level

        Nothing ->
          "-"

    playerLvl =
      case save.player of
        Just player ->
          String.fromInt player.playerLevel

        Nothing ->
          "-"

    playerHp =
      case save.player of
        Just player ->
          (Round.round 2 (toFloat player.currentHealth / toFloat player.maxHealth * 100.0)) ++ "%"

        Nothing ->
          "-"
  in
  pre [ style "position" "absolute"
      , style "left" "35px"
      , style "top" "20px"
      , style "font-family" "Consolas"
      , style "font-weight" "bolder"
      , style "margin" "0px"
      , style "font-size" "1.5rem"
      ]
      [ text ("Name: " ++ playerName)
      , text ("\tDifficulty: " ++ DecodingJson.difficultyToString save.difficulty)
      , text ("\nGame: " ++ gameLvl)
      , text ("\tTime: " ++ (Round.round 3 save.time) ++ "s")
      , text ("\nPlayer LvL: " ++ playerLvl)
      , text ("\tHealth: " ++ playerHp)
      ]

viewEmptyGame : Html Msg
viewEmptyGame =
  pre [ style "position" "absolute"
      , style "left" "125px"
      , style "top" "33px"
      , style "font-family" "Consolas"
      , style "font-weight" "bolder"
      , style "font-size" "3rem"
      , style "margin" "0px"
      ]
      [ text "--- empty ---" ]

view : Model -> Html Msg
view model =
  div [ style "font-family" "monospace" ]
      [ img [ src "assets/default_background_1920_969.png"
            , style "display" "block"
            , style "position" "relative"
            , style "left" "0px"
            , style "top" "0px"
            ] []
      , h1 [ style "position" "absolute"
           , style "left" "760px"
           , style "top" "50px"
           , style "font-size" "5rem"
           --, style "font" "bold 48px Tahoma"
           ] [ text "Load Game" ]
      , a [ style "position" "absolute"
          , style "left" "660px"
          , style "top" "250px"
          , Route.href Route.Game1
          , style "text-decoration" "none"
          , onMouseOver HoverGame1
          , onMouseOut MouseOut
          ]
          [ img [ src model.buttonGame1 ] []  --600 128
          , viewLoadGameInfo model.save1
          ]
      , a [ style "position" "absolute"
          , style "left" "660px"
          , style "top" "428px"
          , Route.href Route.Game2
          , style "text-decoration" "none"
          , onMouseOver HoverGame2
          , onMouseOut MouseOut
          ]
          [ img [ src model.buttonGame2 ] []
          , viewLoadGameInfo model.save2
          ]
      , a [ style "position" "absolute"
          , style "left" "660px"
          , style "top" "606px"
          , Route.href Route.Game3
          , style "text-decoration" "none"
          , onMouseOver HoverGame3
          , onMouseOut MouseOut
          ]
          [ img [ src model.buttonGame3 ] []
          , viewLoadGameInfo model.save3
          ]
      , a [ Route.href Route.Home ]
          [ img [ src model.buttonBack
                , style "position" "absolute"
                , style "left" "752px"
                , style "top" "864px"
                , onMouseOver HoverBack
                , onMouseOut MouseOut
                ] []
          ]
      ]


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
  Ports.reloadPage Reload
