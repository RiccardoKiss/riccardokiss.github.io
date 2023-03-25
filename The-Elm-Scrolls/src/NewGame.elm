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
    , button_back = "assets/button/button_back.png"
    , button_start = "assets/button/button_start.png"
    , difficulty = Medium
    }
  , Cmd.none
  )


radio : Msg -> Bool -> String -> Html Msg
radio  msg isChecked value =
  div [ style "position" "absolute", onClick msg ]
  [ input [ type_ "radio"
          , style "margin-left" "40px"
          , style "width" "5em"
          , style "height" "5em"
          --, onClick msg
          , checked isChecked
          ] []
  , div [ style "position" "absolute"
        , style "left" "110%"
        , style "top" "25%"
        ] [ text value ]
  ]


type Msg
  = HoverBack
  | HoverStart
  | MouseOut
  | DifficultyTo Difficulty


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    HoverBack ->
      ( { model
        | button_back = "assets/button/button_back_hover.png"
        }
      , Cmd.none
      )

    HoverStart ->
      ( { model
        | button_start = "assets/button/button_start_hover.png"
        }
      , Cmd.none
      )

    MouseOut ->
      ( { model
        | button_back = "assets/button/button_back.png"
          , button_start = "assets/button/button_start.png"
        }
      , Cmd.none
      )

    DifficultyTo choice ->
      ( { model
        | difficulty = choice }
      , Cmd.none
      )


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
           , style "left" "895px"
           , style "top" "100px"
           ] [ text "New Game" ]
      , div [ style "position" "absolute"
            , style "left" "700px"
            , style "top" "500px"
            ]
            [ h1 [ style "white-space" "nowrap" ]
                  [ text "Enter name:"
                  , input [ type_ "input", style "margin-left" "40px" ] []
                  ]
            , h1 [ style "position" "absolute", style "white-space" "nowrap" ]
                  [ div [ style "position" "absolute"
                        , style "top" "20px"
                        ] [ text "Difficulty:" ]
                  , div [ style "position" "absolute"
                        , style "left" "150px"
                        , style "top" "0px"
                        ]
                        [ radio ( DifficultyTo Easy ) ( model.difficulty == Easy ) "easy" ]
                  , div [ style "position" "absolute"
                        , style "left" "360px"
                        , style "top" "0px"
                        ]
                        [ radio ( DifficultyTo Medium ) ( model.difficulty == Medium ) "medium" ]
                  , div [ style "position" "absolute"
                        , style "left" "610px"
                        , style "top" "0px"
                        ]
                        [ radio ( DifficultyTo Hard ) ( model.difficulty == Hard ) "hard" ]
                  ]
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
      , a [ Route.href Route.Game ]
          [ img [ src model.button_start
                , style "position" "absolute"
                , style "left" "980px"
                , style "top" "864px"
                , onMouseOver HoverStart
                , onMouseOut MouseOut
                ] []
          ]
      ]
