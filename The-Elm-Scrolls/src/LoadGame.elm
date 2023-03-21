port module LoadGame exposing (..)

import Browser.Navigation as Nav
import Html exposing (Html, div, h1, a, text, img, pre)
import Html.Attributes exposing (src, style)
import Html.Events exposing (onClick, onMouseOver, onMouseOut)

import Route exposing (Route)
import Ports exposing (..)


type alias PlayerFromJS =
  { currentHealth : Int
  , armor : String
  , sword : String
  }

type alias Model =
  { navKey : Nav.Key
  , button_game1 : String
  , button_game2 : String
  , button_game3 : String
  , button_back : String
  , time1 : Float
  }



init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
  ( { navKey = navKey
    , button_game1 = "assets/button/button_loadGameInstance_background.png"
    , button_game2 = "assets/button/button_loadGameInstance_empty.png"
    , button_game3 = "assets/button/button_loadGameInstance_background.png"
    , button_back = "assets/button/button_back.png"
    , time1 = 0.0
    }
  , Cmd.none
  )


getNavKey : Model -> Nav.Key
getNavKey model =
  model.navKey


type Msg
  = HoverBack
  | HoverGame1
  | HoverGame2
  | HoverGame3
  --| ClickedBack
  | MouseOut
  | ReceiveTimeFromJS Float


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    HoverGame1 ->
      ( { model
        | button_game1 = "assets/button/button_loadGameInstance_background_hover.png"
        }
      , Cmd.none
      )

    HoverGame2 ->
      ( { model
        | button_game2 = "assets/button/button_loadGameInstance_empty_hover.png"
        }
      , Cmd.none
      )

    HoverGame3 ->
      ( { model
        | button_game3 = "assets/button/button_loadGameInstance_background_hover.png"
        }
      , Cmd.none
      )

    HoverBack ->
      ( { model
        | button_back = "assets/button/button_back_hover.png"
        }
      , Cmd.none
      )

    MouseOut ->
      ( { model
        | button_game1 = "assets/button/button_loadGameInstance_background.png"
          , button_game2 = "assets/button/button_loadGameInstance_empty.png"
          , button_game3 = "assets/button/button_loadGameInstance_background.png"
          , button_back = "assets/button/button_back.png"
        }
      , Cmd.none
      )

    ReceiveTimeFromJS data ->
      {-let
        playerFromJS =
          { currentHealth = data.currentHealth
          , armor = data.armor
          , sword = data.sword
          }
      in-}
      ( { model
        | time1 = data
        }
      , Cmd.none
      )


view : Model -> { title : String, content : Html Msg }
view model =
  { title = "Load Game"
  , content =
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
           --, style "font" "bold 48px Tahoma"
           ] [ text "Load Game" ]
      , div [ style "position" "absolute"
            , style "left" "660px"
            , style "top" "250px"
            ]
            [ img [ src model.button_game1 --600 128
                  , onMouseOver HoverGame1
                  , onMouseOut MouseOut
                  ] []
            , pre [ style "position" "absolute"
                  --, style "left" "500px"
                  --, style "top" "25px"
                  , style "font-family" "Consolas"
                  , style "font-weight" "bolder"
                  --, style "font-size" "1.75em"
                  ]
                  [ text "Player1 time:"
                  , text (String.fromFloat model.time1)
                  ]
            ]
      , img [ src model.button_game2
            , style "position" "absolute"
            , style "left" "660px"
            , style "top" "428px"
            , onMouseOver HoverGame2
            , onMouseOut MouseOut
            ] []
      , img [ src model.button_game3
            , style "position" "absolute"
            , style "left" "660px"
            , style "top" "606px"
            , onMouseOver HoverGame3
            , onMouseOut MouseOut
            ] []
      , a [ Route.href Route.Home ]
          [ img [ src model.button_back
                , style "position" "absolute"
                , style "left" "752px"
                , style "top" "864px"
                , onMouseOver HoverBack
                , onMouseOut MouseOut
                ] []
          ]
      ]
  }

port receiveTime : (Float -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions _ =
  receiveTime ReceiveTimeFromJS
