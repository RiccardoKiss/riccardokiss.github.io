module HighScores exposing (..)

import Browser.Navigation as Nav
import Html exposing (Html, div, h1, a, text, img, input, pre)
import Html.Attributes exposing (src, style)
import Html.Events exposing (onMouseOver, onMouseOut)
import Array
import Round

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

viewScoreEntry : Maybe DecodingJson.Score -> Html Msg
viewScoreEntry entry =
  case entry of
    Just s ->
      pre [ style "position" "relative"
          , style "display" "block"
          , style "font-family" "Consolas"
          --, style "font-weight" "bolder"
          , style "margin-bottom" "1em"
          , style "font-size" "1.5em"
          ]
          [ text (s.name ++ "\t" ++ s.difficulty ++ "\t\t" ++ (Round.round 2 s.score)) ]
    Nothing ->
      div [] []

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
           , style "top" "100px"
           , style "font-size" "5em"
           , style "margin" "0px"
           ] [ text "High Scores" ]
      , div [ style "position" "absolute"
            , style "left" "760px"
            , style "top" "300px"
            ]
            [ pre [ style "position" "relative"
                  , style "display" "block"
                  , style "border-bottom" "5px double black"
                  , style "font-family" "Consolas"
                  , style "font-weight" "bolder"
                  , style "font-size" "1.5em"
                  ]
                  [ text "Name\tDifficulty\tScore" ]
            , viewScoreEntry (Array.get 0 (Array.fromList model.scores))
            , viewScoreEntry (Array.get 1 (Array.fromList model.scores))
            , viewScoreEntry (Array.get 2 (Array.fromList model.scores))
            , viewScoreEntry (Array.get 3 (Array.fromList model.scores))
            , viewScoreEntry (Array.get 4 (Array.fromList model.scores))
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
