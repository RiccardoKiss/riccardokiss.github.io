module NewGame exposing (..)

import Browser.Navigation as Nav
import Html exposing (Html, div, h1, a, text, img, input)
import Html.Attributes exposing (src, style, type_, autofocus, value, checked)
import Html.Events exposing (onClick, onInput, onMouseOver, onMouseOut)
import Json.Encode as Encode

import Route exposing (Route)
import Ports exposing (..)


type Difficulty
  = Easy
  | Medium
  | Hard

type SavePosition
  = First
  | Second
  | Third

type alias Model =
  { navKey : Nav.Key
  , buttonBack : String
  , buttonStart : String
  , playerName : String
  , difficulty : Difficulty
  , savePosition : SavePosition
  }


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
  ( { navKey = navKey
    , buttonBack = "assets/button/button_back.png"
    , buttonStart = "assets/button/button_start.png"
    , playerName = ""
    , difficulty = Medium
    , savePosition = First
    }
  , Cmd.none
  )


type Msg
  = HoverBack
  | HoverStart
  | MouseOut
  | NameChanged String
  | DifficultyTo Difficulty
  | SaveTo SavePosition


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    HoverBack ->
      ( { model
        | buttonBack = "assets/button/button_back_hover.png"
        }
      , Cmd.none
      )

    HoverStart ->
      ( { model
        | buttonStart = "assets/button/button_start_hover.png"
        }
      , createSave model
      )

    MouseOut ->
      ( { model
        | buttonBack = "assets/button/button_back.png"
        , buttonStart = "assets/button/button_start.png"
        }
      , Cmd.none
      )

    NameChanged name ->
      ( { model | playerName = name }
      , Cmd.none
      )

    DifficultyTo choice ->
      ( { model | difficulty = choice }
      , Cmd.none
      )

    SaveTo position ->
      ( { model | savePosition = position }
      , Cmd.none
      )

createSave : Model -> Cmd msg
createSave model =
  let
    encodeSave =
      Encode.object
        [ ( "name", Encode.string model.playerName )
        , ( "difficulty", Encode.string (difficultyToString model.difficulty) )
        , ( "player", Encode.null )
        , ( "level", Encode.null )
        , ( "time", Encode.float 0.0 )
        ]
  in
  case model.savePosition of
    First ->
      encodeSave
      |> Ports.storeSave1

    Second ->
      encodeSave
      |> Ports.storeSave2

    Third ->
      encodeSave
      |> Ports.storeSave3

difficultyToString : Difficulty -> String
difficultyToString difficulty =
  case difficulty of
    Easy ->
      "easy"

    Medium ->
      "medium"

    Hard ->
      "hard"

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
                  , input [ type_ "text"
                          , autofocus True
                          , onInput NameChanged
                          , value model.playerName
                          , style "margin-left" "40px"
                          ] []
                  ]
            , h1  [ style "position" "absolute"
                  , style "white-space" "nowrap"
                  ]
                  [ div [ style "position" "absolute"
                        , style "top" "20px"
                        ] [ text "Difficulty:" ]
                  , div [ style "position" "absolute"
                        , style "left" "175px"
                        , style "top" "0px"
                        ]
                        [ radio ( DifficultyTo Easy ) ( model.difficulty == Easy ) "easy" ]
                  , div [ style "position" "absolute"
                        , style "left" "375px"
                        , style "top" "0px"
                        ]
                        [ radio ( DifficultyTo Medium ) ( model.difficulty == Medium ) "medium" ]
                  , div [ style "position" "absolute"
                        , style "left" "625px"
                        , style "top" "0px"
                        ]
                        [ radio ( DifficultyTo Hard ) ( model.difficulty == Hard ) "hard" ]
                  ]
            , h1  [ style "position" "absolute"
                  , style "top" "150px"
                  , style "white-space" "nowrap"
                  ]
                  [ div [ style "position" "absolute"
                        , style "top" "20px"
                        ] [ text "Save position:" ]
                  , div [ style "position" "absolute"
                        , style "left" "175px"
                        , style "top" "0px"
                        ]
                        [ radio ( SaveTo First ) ( model.savePosition == First ) "1" ]
                  , div [ style "position" "absolute"
                        , style "left" "375px"
                        , style "top" "0px"
                        ]
                        [ radio ( SaveTo Second ) ( model.savePosition == Second ) "2" ]
                  , div [ style "position" "absolute"
                        , style "left" "625px"
                        , style "top" "0px"
                        ]
                        [ radio ( SaveTo Third ) ( model.savePosition == Third ) "3" ]
                  ]
            ]
      , a [ Route.href Route.Home ]
          [ img [ src model.buttonBack
                , style "position" "absolute"
                , style "left" "524px"
                , style "top" "864px"
                , onMouseOver HoverBack
                , onMouseOut MouseOut
                ] []
          ]
      , a [ Route.href Route.Game ]
          [ img [ src model.buttonStart
                , style "position" "absolute"
                , style "left" "980px"
                , style "top" "864px"
                , onMouseOver HoverStart
                , onMouseOut MouseOut
                ] []
          ]
      ]
