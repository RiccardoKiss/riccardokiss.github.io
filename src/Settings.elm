module Settings exposing (..)

import Browser.Navigation as Nav
import Html exposing (Html, div, h1, a, text, img, input)
import Html.Attributes exposing (src, style, type_, checked)
import Html.Events exposing (onClick, onMouseOver, onMouseOut)
import Json.Encode as Encode

import Route exposing (Route)
import Ports exposing (..)


type Music
  = On
  | Off

type Movement
  = WASD
  | Arrows

type alias Model =
  { navKey : Nav.Key
  , buttonBack : String
  , music : Music
  , movement : Movement
  }


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
  ( { navKey = navKey
    , buttonBack = "assets/button/button_back.png"
    , music = Off
    , movement = WASD
    }
  , Cmd.none
  )


type Msg
  = HoverBack
  --| ClickedBack
  | MouseOut
  | MusicTo Music
  | MovementTo Movement


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    HoverBack ->
      ( { model
        | buttonBack = "assets/button/button_back_hover.png"
        }
      , saveSettings model
      )

    MouseOut ->
      ( { model
        | buttonBack = "assets/button/button_back.png"
        }
      , Cmd.none
      )

    MusicTo choice ->
      ( { model
        | music = choice }
      , Cmd.none
      )

    MovementTo choice ->
      ( { model
        | movement = choice }
      , Cmd.none
      )

saveSettings : Model -> Cmd msg
saveSettings model =
  let
    musicToString =
      case model.music of
        On ->
          "on"

        Off ->
          "off"
    movementToString =
      case model.movement of
        WASD ->
          "wasd"

        Arrows ->
          "arrows"
    encodedSettings =
      Encode.object
        [ ( "music", Encode.string musicToString )
        , ( "movement", Encode.string movementToString )
        ]
  in
  Ports.storeSettings encodedSettings

radio : Msg -> Bool -> String -> Html Msg
radio  msg isChecked value =
  div [ style "position" "absolute", onClick msg ]
      [ input [ type_ "radio"
              , style "margin-left" "40px"
              , style "width" "5em"
              , style "height" "5em"
              , checked isChecked
              ] []
      , div [ style "position" "absolute"
            , style "left" "110%"
            , style "top" "25%"
            ] [ text value ]
      ]

viewMovementKeys : Movement -> Html Msg
viewMovementKeys mov =
  case mov of
    WASD ->
      div [ style "position" "absolute"
          , style "left" "150px"
          , style "top" "0px"
          ]
          [ div [ style "position" "absolute"
                , style "left" "52px"
                ] [ img [ src "assets/button/w_48_48.png" ] [] ]
          , div [ style "position" "absolute"
                , style "top" "52px"
                ] [ img [ src "assets/button/a_48_48.png" ] [] ]
          , div [ style "position" "absolute"
                , style "left" "52px"
                , style "top" "52px"
                ] [ img [ src "assets/button/s_48_48.png" ] [] ]
          , div [ style "position" "absolute"
                , style "left" "104px"
                , style "top" "52px"
                ] [ img [ src "assets/button/d_48_48.png" ] [] ]
          ]

    Arrows ->
      div [ style "position" "absolute"
          , style "left" "150px"
          , style "top" "0px"
          ]
          [ div [ style "position" "absolute"
                , style "left" "52px"
                ] [ img [ src "assets/button/arrowUp_48_48.png" ] [] ]
          , div [ style "position" "absolute"
                , style "top" "52px"
                ] [ img [ src "assets/button/arrowLeft_48_48.png" ] [] ]
          , div [ style "position" "absolute"
                , style "left" "52px"
                , style "top" "52px"
                ] [ img [ src "assets/button/arrowDown_48_48.png" ] [] ]
          , div [ style "position" "absolute"
                , style "left" "104px"
                , style "top" "52px"
                ] [ img [ src "assets/button/arrowRight_48_48.png" ] [] ]
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
           , style "left" "800px"
           , style "top" "100px"
           , style "font-size" "5em"
           , style "margin" "0px"
           ] [ text "Settings" ]
      , h1 [ style "position" "absolute"
           , style "white-space" "nowrap"
           , style "left" "500px"
           , style "top" "300px"
           ]
           [ div [ style "position" "absolute"
                 , style "top" "10px"
                 , style "font-size" "1.5em"
                 ] [ text "Music:" ]
           , div [ style "position" "absolute"
                 , style "left" "175px"
                 , style "top" "0px"
                 ]
                 [ radio ( MusicTo Off ) ( model.music == Off ) "off" ]
           , div [ style "position" "absolute"
                 , style "left" "600px"
                 , style "top" "0px"
                 ]
                 [ radio ( MusicTo On ) ( model.music == On ) "on" ]
           ]
      , h1 [ style "position" "absolute"
           , style "white-space" "nowrap"
           , style "left" "500px"
           , style "top" "550px"
           ]
           [ div [ style "position" "absolute"
                 , style "top" "10px"
                 , style "font-size" "1.5em"
                 ] [ text "Movement:" ]
           , div [ style "position" "absolute"
                 , style "left" "180px"
                 , style "top" "0px"
                 ]
                 [ radio ( MovementTo WASD ) ( model.movement == WASD ) ""
                 , viewMovementKeys WASD
                 ]
           , div [ style "position" "absolute"
                 , style "left" "605px"
                 , style "top" "0px"
                 ]
                 [ radio ( MovementTo Arrows ) ( model.movement == Arrows ) ""
                 , viewMovementKeys Arrows
                 ]
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
