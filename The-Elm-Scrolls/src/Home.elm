module Home exposing (..)

import Browser
import Browser.Navigation as Nav
import Browser.Events exposing (..)
import Html exposing (Html, a, button, div, text, img)
import Html.Attributes exposing (srcdoc, src, width, height, style)
import Html.Events exposing (onClick, onMouseOver, onMouseOut)
import Route exposing (Route)

import Playground exposing (..)
import Player exposing (..)

{-
-- MAIN

main =
  Browser.sandbox
  { init = init
  , update = update
  , view = view
  }


-- MODEL

type alias Model =
  Int

init : Model
init =
  1


-- UPDATE

type Msg
  = Increment
  | Decrement

update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1


-- VIEW

view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (String.fromInt model) ]
    , button [ onClick Increment ] [ text "+" ]
    , div [style "background-color" "red"] [ img [src "assets/playerIdle1.png"] [] ]
    , iframe [ heig-- MAIN

    main =
      Browser.sandbox
      { init = init
      , update = update
      , view = view
      }


    -- MODEL

    type alias Model =
      Int

    init : Model
    init =
      1


    -- UPDATE

    type Msg
      = Increment
      | Decrement

    update : Msg -> Model -> Model
    update msg model =
      case msg of
        Increment ->
          model + 1

        Decrement ->
          model - 1


    -- VIEW

    view : Model -> Html Msg
    view model =
      div []
        [ button [ onClick Decrement ] [ text "-" ]
        , div [] [ text (String.fromInt model) ]
        , button [ onClick Increment ] [ text "+" ]
        , div [style "background-color" "red"] [ img [src "assets/playerIdle1.png"] [] ]
        , iframe [ height 100% ]  -- https://stackoverflow.com/questions/34539606/elm-how-to-use-an-iframe
        ]ht 100% ]  -- https://stackoverflow.com/questions/34539606/elm-how-to-use-an-iframe
    ]
-}
-- MAIN




-- MODEL

type alias Model =
  { navKey : Nav.Key
  , button_newGame : String
  , button_loadGame : String
  , button_highScore : String
  , button_settings : String
  , button_help : String
  }

initModel : Nav.Key -> Model
initModel navKey =
  { navKey = navKey
  , button_newGame = "assets/buttons/button_newGame.png"
  , button_loadGame = "assets/buttons/button_loadGame.png"
  , button_highScore = "assets/buttons/button_highScore.png"
  , button_settings = "assets/buttons/button_settings.png"
  , button_help = "assets/buttons/button_help.png"
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

-- UPDATE

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
    --ClickedSettings ->
      --( { model |}, Cmd.none )
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

-- VIEW

view : Model -> { title : String, content : Html Msg }
view model =
  { title = "Home"
  , content =
      div []
        [ img [src "assets/mainMenu_background_1920_969.png"
              , style "position" "relative"
              , style "left" "0px"
              , style "top" "0px"
              ] []
        , img [ src model.button_newGame
              , style "position" "absolute"
              , style "left" "752px"
              , style "top" "416px"
              , onMouseOver HoverNewGame
              , onMouseOut MouseOut
              ] []
        , img [ src model.button_loadGame
              , style "position" "absolute"
              , style "left" "752px"
              , style "top" "528px"
              , onMouseOver HoverLoadGame
              , onMouseOut MouseOut
              ] []
        , img [ src model.button_highScore
              , style "position" "absolute"
              , style "left" "752px"
              , style "top" "640px"
              , onMouseOver HoverHighScore
              , onMouseOut MouseOut
              ] []
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
        , img [ src model.button_help
              , style "position" "absolute"
              , style "left" "752px"
              , style "top" "864px"
              , onMouseOver HoverHelp
              , onMouseOut MouseOut
              ] []
        ]
  }
{-
main =
  game view update (0,0)

view computer (x,y) =
  [ image 32 64 "assets/playerIdle250ms.gif"
      |> move x y
  ]

update computer (x,y) =
  ( x + toX computer.keyboard
  , y + toY computer.keyboard
  )
-}

{-
subscriptions : Model -> Sub Msg
subscriptions =
    Sub.none

main =
  Browser.element
  { init : init
  , view : view
  , update : update
  , subscriptions : subscriptions
  ,
}
-}
