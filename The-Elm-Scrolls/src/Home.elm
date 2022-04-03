module Home exposing (..)

import Browser
import Browser.Navigation as Nav
import Browser.Events exposing (..)
import Html exposing (Html, a, div, img)
import Html.Attributes exposing (src, style)
import Html.Events exposing (onClick, onMouseOver, onMouseOut)
import Route exposing (Route)


type alias Model =
  { navKey : Nav.Key
  , button_newGame : String
  , button_loadGame : String
  , button_highScore : String
  , button_settings : String
  , button_help : String
  }


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
  ( { navKey = navKey
    , button_newGame = "assets/buttons/button_newGame.png"
    , button_loadGame = "assets/buttons/button_loadGame.png"
    , button_highScore = "assets/buttons/button_highScore.png"
    , button_settings = "assets/buttons/button_settings.png"
    , button_help = "assets/buttons/button_help.png"
    }
  , Cmd.none
  )


getNavKey : Model -> Nav.Key
getNavKey model =
  model.navKey


type Msg
  = HoverNewGame
  | HoverLoadGame
  | HoverHighScore
  | HoverSettings
  | HoverHelp
  --| ClickedSettings
  | MouseOut


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    HoverNewGame ->
      ( { model
        | button_newGame = "assets/buttons/button_newGame_hover.png"
        }
      , Cmd.none
      )

    HoverLoadGame ->
      ( { model
        | button_loadGame = "assets/buttons/button_loadGame_hover.png"
        }
      , Cmd.none
      )

    HoverHighScore ->
      ( { model
        | button_highScore = "assets/buttons/button_highScore_hover.png"
        }
      , Cmd.none
      )

    HoverSettings ->
      ( { model
        | button_settings = "assets/buttons/button_settings_hover.png"
        }
      , Cmd.none
      )

    HoverHelp ->
      ( { model
        | button_help = "assets/buttons/button_help_hover.png"
        }
      , Cmd.none
      )

    MouseOut ->
      ( { model
        | button_newGame = "assets/buttons/button_newGame.png"
          , button_loadGame = "assets/buttons/button_loadGame.png"
          , button_highScore = "assets/buttons/button_highScore.png"
          , button_settings = "assets/buttons/button_settings.png"
          , button_help = "assets/buttons/button_help.png"
        }
      , Cmd.none
      )


view : Model -> { title : String, content : Html Msg }
view model =
  { title = "Home"
  , content =
      div []
        [ img [src "assets/mainMenu_background_1920_969.png"
              , style "display" "block"
              , style "position" "relative"
              , style "left" "0px"
              , style "top" "0px"
              ] []
        , a [ Route.href Route.NewGame ]
            [ img [ src model.button_newGame
                  , style "position" "absolute"
                  , style "left" "752px"
                  , style "top" "416px"
                  , onMouseOver HoverNewGame
                  , onMouseOut MouseOut
                  ] []
            ]
        , img [ src model.button_loadGame
              , style "position" "absolute"
              , style "left" "752px"
              , style "top" "528px"
              , onMouseOver HoverLoadGame
              , onMouseOut MouseOut
              ] []
        , a [ Route.href Route.HighScores ]
            [ img [ src model.button_highScore
                  , style "position" "absolute"
                  , style "left" "752px"
                  , style "top" "640px"
                  , onMouseOver HoverHighScore
                  , onMouseOut MouseOut
                  ] []
            ]
        , a [ Route.href Route.Settings ]
            [ img [ src model.button_settings
                  , style "position" "absolute"
                  , style "left" "752px"
                  , style "top" "752px"
                  , onMouseOver HoverSettings
                  , onMouseOut MouseOut
                  --, onClick ClickedSettings
                  ] []
            ]
        , a [ Route.href Route.Help ]
            [ img [ src model.button_help
                  , style "position" "absolute"
                  , style "left" "752px"
                  , style "top" "864px"
                  , onMouseOver HoverHelp
                  , onMouseOut MouseOut
                  ] []
            ]
        ]
  }
