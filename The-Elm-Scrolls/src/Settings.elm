module Settings exposing (..)

import Browser.Navigation as Nav
import Html exposing (Html, div, h1, a, text, img)
import Html.Attributes exposing (src, style)
import Html.Events exposing (onClick, onMouseOver, onMouseOut)
import Route exposing (Route)


type alias Model =
  { navKey : Nav.Key
  , button_back : String
  }

init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
  ( { navKey = navKey
    , button_back = "assets/buttons/button_back.png"
    }
  , Cmd.none
  )

getNavKey : Model -> Nav.Key
getNavKey model =
  model.navKey

type Msg
  = HoverBack
  --| ClickedBack
  | MouseOut

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    HoverBack ->
      ( { model
        | button_back = "assets/buttons/button_back_hover.png"
        }
      , Cmd.none
      )
    MouseOut ->
      ( { model
        | button_back = "assets/buttons/button_back.png"
        }
      , Cmd.none
      )

view : Model -> { title : String, content : Html Msg }
view model =
  { title = "Settings"
  , content =
    div []
      [ img [ src "assets/default_background_1920_969.png"
            , style "position" "relative"
            , style "left" "0px"
            , style "top" "0px"
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
