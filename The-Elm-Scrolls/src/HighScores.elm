module HighScores exposing (..)

import Browser.Navigation as Nav
import Html exposing (Html, div, h1, a, text, img, input, p)
import Html.Attributes exposing (src, style, type_)
import Html.Events exposing (onClick, onMouseOver, onMouseOut)

import Route exposing (Route)
import DecodingJson exposing (..)


type alias Model =
  { navKey : Nav.Key
  , scores : List DecodingJson.Score
  , buttonBack : String
  }


init : Maybe (List DecodingJson.Score) -> Nav.Key -> ( Model, Cmd Msg )
init highScores navKey =
  ( { navKey = navKey
    , scores =
        case highScores of
          Just hS ->
            hS

          Nothing ->
            []

    , buttonBack = "assets/button/button_back.png"
    }
  , Cmd.none
  )


type Msg
  = HoverBack
  --| ClickedBack
  | MouseOut


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    HoverBack ->
      ( { model
        | buttonBack = "assets/button/button_back_hover.png"
        }
      , Cmd.none
      )

    MouseOut ->
      ( { model
        | buttonBack = "assets/button/button_back.png"
        }
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
           , style "left" "800px"
           , style "top" "100px"
           ] [ text "High Scores" ]
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
