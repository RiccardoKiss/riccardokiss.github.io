module NewGame exposing (..)

import Browser.Navigation as Nav
import Html exposing (Html, div, h1, a, text, img, input)
import Html.Attributes exposing (src, style, type_, checked)
import Html.Events exposing (onClick, onMouseOver, onMouseOut)
import Route exposing (Route)


type Difficulty
  = Easy
  | Medium
  | Hard


type alias Model =
  { navKey : Nav.Key
  , button_back : String
  , button_start : String
  , difficulty : Difficulty
  }


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
  ( { navKey = navKey
    , button_back = "assets/buttons/button_back.png"
    , button_start = "assets/buttons/button_start.png"
    , difficulty = Medium
    }
  , Cmd.none
  )


getNavKey : Model -> Nav.Key
getNavKey model =
  model.navKey


radio : msg -> Bool -> String -> List ( Html msg )
radio  msg isChecked value =
  [ input [ type_ "radio"
          , style "margin-left" "40px"
          , onClick msg
          , checked isChecked
          ] []
  , text value
  ]


type Msg
  = HoverBack
  | HoverStart
  --| ClickedBack
  | MouseOut
  | DifficultyTo Difficulty


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    HoverBack ->
      ( { model
        | button_back = "assets/buttons/button_back_hover.png"
        }
      , Cmd.none
      )

    HoverStart ->
      ( { model
        | button_start = "assets/buttons/button_start_hover.png"
        }
      , Cmd.none
      )

    MouseOut ->
      ( { model
        | button_back = "assets/buttons/button_back.png"
          , button_start = "assets/buttons/button_start.png"
        }
      , Cmd.none
      )

    DifficultyTo choice ->
      ( { model
        | difficulty = choice }
      , Cmd.none
      )


view : Model -> { title : String, content : Html Msg }
view model =
  { title = "New Game"
  , content =
    div []
      [ img [ src "assets/default_background_1920_969.png"
            , style "display" "block"
            , style "position" "relative"
            , style "left" "0px"
            , style "top" "0px"
            ] []
      , h1 [ style "position" "absolute"
           , style "left" "800px"
           , style "top" "100px"
           ] [ text "New Game" ]
      , div [ style "position" "absolute"
            , style "left" "700px"
            , style "top" "500px"
            ]
            [ h1 [style "white-space" "nowrap"]
                 [ text "Enter name:"
                 , input [ type_ "input", style "margin-left" "40px" ] []
                 ]
            , h1 [style "white-space" "nowrap"]
                 ([ text "Difficulty:" ]
                 ++ radio ( DifficultyTo Easy ) ( model.difficulty == Easy ) "easy"
                 ++ radio ( DifficultyTo Medium ) ( model.difficulty == Medium ) "medium"
                 ++ radio ( DifficultyTo Hard ) ( model.difficulty == Hard ) "hard"
                 )
            ]
      , a [ Route.href Route.Home ]
          [ img [ src model.button_back
                , style "position" "absolute"
                , style "left" "524px"
                , style "top" "864px"
                , onMouseOver HoverBack
                , onMouseOut MouseOut
                ] []
          ]
      , img [ src model.button_start
            , style "position" "absolute"
            , style "left" "980px"
            , style "top" "864px"
            , onMouseOver HoverStart
            , onMouseOut MouseOut
            ] []
      ]
  }
