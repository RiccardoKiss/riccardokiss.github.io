module Help exposing (..)

import Browser.Navigation as Nav
import Html exposing (Html, div, h1, a, text, img, button, pre, p)
import Html.Attributes exposing (src, style)
import Html.Events exposing (onClick, onMouseOver, onMouseOut)

import Route exposing (Route)


type Tab
  = Controls
  | Armors
  | Weapons
  | Enemies

type alias Model =
  { navKey : Nav.Key
  , activeTab : Tab
  , buttonBack : String
  }


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
  ( { navKey = navKey
    , activeTab = Controls
    , buttonBack = "assets/button/button_back.png"
    }
  , Cmd.none
  )


type Msg
  = HoverBack
  | MouseOut
  | ActiveTabTo Tab


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

    ActiveTabTo tab ->
      ( { model | activeTab = tab }
      , Cmd.none
      )

tabToString : Tab -> String
tabToString tab =
  case tab of
    Controls ->
      "Controls"

    Armors ->
      "Armors"

    Weapons ->
      "Weapons"

    Enemies ->
      "Enemies"

viewTabButton : Tab -> Tab -> Html Msg
viewTabButton tab activeTab =
  let
    buttonBgColor =
      if tab == activeTab then
        "#deb787"
      else
        "#fad1a0"
  in
  button  [ style "display" "block"
          , style "color" "black"
          , style "width" "100%"
          , style "height" "3em"
          , style "border" "none"
          , style "outline" "none"
          , style "cursor" "pointer"
          , style "transition" "0.3s"
          , style "font-size" "2em"
          , style "border-right" "2px solid black"
          , style "background-color" buttonBgColor
          --, onMouseOver (style "background-color" "#f4d6b0")
          , onClick (ActiveTabTo tab)
          ]
          [ text (tabToString tab) ]


viewTabContent : Tab -> Html Msg
viewTabContent tab =
  let
    content =
      case tab of
        Controls ->
          viewControlsContent

        Armors ->
          viewArmorsContent

        Weapons ->
          viewWeaponsContent

        Enemies ->
          viewEnemiesContent
  in
  div [ style "float" "left"
      , style "width" "80%"
      , style "height" "100%"
      , style "overflow-y" "auto"
      , style "overflow-x" "hidden"
      , style "display" "block"
      ]
      content

tabContentHeaderStyle : String -> String -> List (Html.Attribute msg)
tabContentHeaderStyle left top =
  [ style "font-size" "2.5em"
  , style "font-weight" "bold"
  , style "text-decoration" "underline"
  , style "margin" "unset"
  , style "display" "unset"
  , style "position" "relative"
  , style "left" left
  , style "top" top
  ]

tabContentTextStyle : String -> String -> List (Html.Attribute msg)
tabContentTextStyle left top =
  [ style "font-size" "1.5em"
  , style "margin" "unset"
  , style "display" "unset"
  , style "position" "relative"
  , style "left" left
  , style "top" top
  ]

tabContentImageStyle : String -> String -> String -> List (Html.Attribute msg)
tabContentImageStyle left top imgPath =
  [ src imgPath
  , style "margin" "unset"
  , style "display" "unset"
  , style "position" "relative"
  , style "left" left
  , style "top" top
  ]

viewControlsContent : List (Html Msg)
viewControlsContent =
  [ pre (tabContentHeaderStyle "40%" "0%") [ text "Movement" ]
  , pre (tabContentTextStyle "-0.5%" "10%") [ text "Up" ]
  , pre (tabContentTextStyle "-11%" "40%") [ text "Left" ]
  , pre (tabContentTextStyle "-9.5%" "40%") [ text "Down" ]
  , pre (tabContentTextStyle "-8%" "40%") [ text "Right" ]
  , img (tabContentImageStyle "-21.5%" "23%" "assets/button/w_48_48.png") []
  , img (tabContentImageStyle "-34%" "35%" "assets/button/a_48_48.png") []
  , img (tabContentImageStyle "-33%" "35%" "assets/button/s_48_48.png") []
  , img (tabContentImageStyle "-32%" "35%" "assets/button/d_48_48.png") []
  , pre (tabContentTextStyle "-13%" "25%") [ text "Or" ]
  , img (tabContentImageStyle "9.5%" "23%" "assets/button/arrowUp_48_48.png") []
  , img (tabContentImageStyle "-3%" "35%" "assets/button/arrowLeft_48_48.png") []
  , img (tabContentImageStyle "-2%" "35%" "assets/button/arrowDown_48_48.png") []
  , img (tabContentImageStyle "-1%" "35%" "assets/button/arrowRight_48_48.png") []
  , pre (tabContentHeaderStyle "-73%" "56%") [ text "Attack" ]
  , img (tabContentImageStyle "7%" "60%" "assets/button/spacebar_192_48.png") []
  , pre (tabContentTextStyle "-8%" "65%") [ text "Press" ]
  , pre (tabContentHeaderStyle "25%" "45%") [ text "Use Consumables" ]
  , img (tabContentImageStyle "-7%" "60%" "assets/button/q_48_48.png") []
  , pre (tabContentTextStyle "-13%" "65%") [ text "Press" ]
  , img (tabContentImageStyle "7%" "60%" "assets/button/e_48_48.png") []
  , pre (tabContentTextStyle "81%" "54%") [ text "Press" ]
  , pre (tabContentHeaderStyle "-2%" "77%") [ text "Show Character Details" ]
  , img (tabContentImageStyle "-30%" "94%" "assets/button/c_48_48.png") []
  , pre (tabContentTextStyle "-35.5%" "100%") [ text "Hold" ]
  , pre (tabContentHeaderStyle "0%" "77%") [ text "Pause the Game" ]
  , img (tabContentImageStyle "75%" "83%" "assets/button/esc_96_48.png") []
  , pre (tabContentTextStyle "66%" "88%") [ text "Press" ]
  ]

viewArmorsContent : List (Html Msg)
viewArmorsContent =
  [ div [ style "display" "flex"
        , style "justify-content" "space-evenly"
        ]
        [ img ((tabContentImageStyle "0%" "0%" "assets/player/player_EEE_256_512.png") ++ [style "height" "30em"]) []
        , img ((tabContentImageStyle "0%" "0%" "assets/player/player_LLL_256_512.png") ++ [style "height" "30em"]) []
        , img ((tabContentImageStyle "0%" "0%" "assets/player/player_SSS_256_512.png") ++ [style "height" "30em"]) []
        , img ((tabContentImageStyle "0%" "0%" "assets/player/player_DDD_256_512.png") ++ [style "height" "30em"]) []
        ]
  , div [ style "display" "flex"
        , style "justify-content" "space-evenly"
        ]
        [ pre (tabContentHeaderStyle "0%" "20%") [ text "None Set" ]
        , pre (tabContentHeaderStyle "0%" "20%") [ text "Leather Set" ]
        , pre (tabContentHeaderStyle "0%" "20%") [ text "Silver Set" ]
        , pre (tabContentHeaderStyle "0%" "20%") [ text "Dragon Set" ]
        ]
  , div [ style "display" "flex"
        , style "justify-content" "space-around"
        ]
        [ pre (tabContentTextStyle "0%" "25%") [ text "Helmet\t    0\nChestplate  1\nLegs\t    1\n\nTotal DEF:  2" ]
        , pre (tabContentTextStyle "0%" "25%") [ text "Helmet\t    10\nChestplate  10\nLegs\t    10\n\nTotal DEF:  30" ]
        , pre (tabContentTextStyle "0%" "25%") [ text "Helmet\t    20\nChestplate  20\nLegs\t    20\n\nTotal DEF:  60" ]
        , pre (tabContentTextStyle "0%" "25%") [ text "Helmet\t    30\nChestplate  30\nLegs\t    30\n\nTotal DEF:  90" ]
        ]
  ]

viewWeaponsContent : List (Html Msg)
viewWeaponsContent =
  [ div []
        [ div [ style "display" "flex"
              , style "justify-content" "space-evenly"
              ]
              [ img ((tabContentImageStyle "0%" "0%" "assets/sword/sword_wood_128_128.png") ++ [style "height" "50%"]) []
              , img ((tabContentImageStyle "0%" "0%" "assets/sword/sword_stone_128_128.png") ++ [style "height" "50%"]) []
              ]
        , div [ style "display" "flex"
              , style "justify-content" "space-evenly"
              ]
              [ pre (tabContentHeaderStyle "0%" "20%") [ text "Wooden Sword" ]
              , pre (tabContentHeaderStyle "0%" "20%") [ text "Stone Sword" ]
              ]
        , div [ style "display" "flex"
              , style "justify-content" "space-evenly"
              ]
              [ pre (tabContentTextStyle "0%" "25%") [ text "Attack\t5" ]
              , pre (tabContentTextStyle "0%" "25%") [ text "Attack\t10" ]
              ]
        ]
  , div []
        [div [ style "display" "flex"
              , style "justify-content" "space-evenly"
              ]
              [ img ((tabContentImageStyle "0%" "0%" "assets/sword/sword_iron_128_128.png") ++ [style "height" "50%"]) []
              , img ((tabContentImageStyle "0%" "0%" "assets/sword/sword_dragon_128_128.png") ++ [style "height" "50%"]) []
              ]
        , div [ style "display" "flex"
              , style "justify-content" "space-evenly"
              ]
              [ pre (tabContentHeaderStyle "0%" "20%") [ text "Iron Sword" ]
              , pre (tabContentHeaderStyle "0%" "20%") [ text "Dragon Sword" ]
              ]
        , div [ style "display" "flex"
              , style "justify-content" "space-evenly"
              ]
              [ pre (tabContentTextStyle "0%" "25%") [ text "Attack\t15" ]
              , pre (tabContentTextStyle "0%" "25%") [ text "Attack\t20" ]
              ]
        ]
  ]

viewEnemiesContent : List (Html Msg)
viewEnemiesContent =
  --div []
  []

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
           , style "left" "46.28%"
           , style "top" "7%"
           , style "font-size" "5em"
           , style "margin" "0px"
           ] [ text "Help" ]
      , img [ src "assets/character_screen_scroll_background_1200_600.png"
            , style "position" "absolute"
            , style "left" "15%"
            , style "top" "18%"
            , style "width" "70%"
            ] []
      , div [ style "position" "absolute"
            , style "left" "15%"
            , style "top" "18%"
            , style "width" "55%"
            , style "height" "50%"
            , style "padding-left" "7.5%"
            , style "padding-right" "7.5%"
            , style "padding-top" "5%"
            ]
            [
            div [ style "float" "left"
                , style "width" "20%"
                , style "height" "auto"
                ]
                [ viewTabButton Controls model.activeTab
                , viewTabButton Armors model.activeTab
                , viewTabButton Weapons model.activeTab
                , viewTabButton Enemies model.activeTab
                ]
            , viewTabContent model.activeTab
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
