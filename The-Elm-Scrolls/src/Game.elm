module Game exposing  (..)

import Browser
import Browser.Navigation as Nav
import Browser.Dom exposing (getViewport)
import Browser.Events exposing (onAnimationFrameDelta, onResize)
import Game.Resources as Resources exposing (Resources)
import Game.TwoD as Game2d
import Game.TwoD.Camera as Camera exposing (Camera)
import Game.TwoD.Render as Render exposing (Renderable)
import Html exposing (Html, div)
import Html.Attributes as Attr
import Keyboard
import Keyboard.Arrows
import Task

type Msg
    = Tick Float
    --| ScreenSize Int Int
    | Resources Resources.Msg
    | Keys Keyboard.Msg



-- MODEL


type alias Model =
    { navKey : Nav.Key
    , mario : Mario
    , resources : Resources
    , keys : List Keyboard.Key
    , time : Float
    , screen : ( Int, Int )
    , camera : Camera
    }


type alias Mario =
    { x : Float
    , y : Float
    , vx : Float
    , vy : Float
    , dir : Direction
    }


type Direction
    = Left
    | Right


getNavKey : Model -> Nav.Key
getNavKey model =
  model.navKey


mario : Mario
mario =
    { x = 0
    , y = 0
    , vx = 0
    , vy = 0
    , dir = Right
    }


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
    ( { navKey = navKey
      , mario = mario
      , resources = Resources.init
      , keys = []
      , time = 0
      , screen = ( 800, 600 )
      , camera = Camera.fixedWidth 8 ( 0, 0 )
      }
    , Cmd.none
    --, Cmd.batch
      --  [ Cmd.map Resources (Resources.loadTextures [ "images/guy.png", "images/grass.png", "images/cloud_bg.png" ])
        --, Task.perform (\{ viewport } -> ScreenSize (round viewport.width) (round viewport.height)) getViewport
        --]
    )


type alias Input =
    { x : Int, y : Int }



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        --ScreenSize width height ->
          --  ( { model | screen = ( width, height ) }
            --, Cmd.none
            --)

        Tick dt ->
            ( { model
                | mario = tick dt model.keys model.mario
                , time = dt + model.time
                , camera = Camera.moveTo ( model.mario.x, model.mario.y + 0.75 ) model.camera
              }
            , Cmd.none
            )

        Resources rMsg ->
            ( { model | resources = Resources.update rMsg model.resources }
            , Cmd.none
            )

        Keys keyMsg ->
            let
                keys =
                    Keyboard.update keyMsg model.keys
            in
            ( { model | keys = keys }, Cmd.none )


tick : Float -> List Keyboard.Key -> Mario -> Mario
tick dt keys guy =
    let
        arrows =
            Keyboard.Arrows.arrows keys
    in
    guy
        --|> gravity dt
        --|> jump arrows
        |> walk arrows
        |> physics dt

{-
jump : Input -> Mario -> Mario
jump keys guy =
    if keys.y > 0 && guy.vy == 0 then
        { guy | vy = 4.0 }

    else
        guy


gravity : Float -> Mario -> Mario
gravity dt guy =
    { guy
        | vy =
            if guy.y > 0 then
                guy.vy - 9.81 * dt

            else
                0
    }
-}

physics : Float -> Mario -> Mario
physics dt guy =
    { guy
        | x = guy.x + dt * guy.vx
        , y = max 0 (guy.y + dt * guy.vy)
    }


walk : Input -> Mario -> Mario
walk keys guy =
    { guy
        | vx = toFloat keys.x
        , dir =
            if keys.x < 0 then
                Left

            else if keys.x > 0 then
                Right

            else
                guy.dir
    }



-- VIEW


render : Model -> List Renderable
render ({ resources, camera } as model) =
    List.concat
        [ [ renderMario resources model.mario ] ]
        {-
        [ renderBackground resources
        , [ Render.spriteWithOptions
                { position = ( -10, -10, 0 )
                , size = ( 20, 10 )
                , texture = Resources.getTexture "images/grass.png" resources
                , rotation = 0
                , pivot = ( 0, 0 )
                , tiling = ( 10, 5 )
                }
          , renderMario resources model.mario
          ]
        ]
        -}
{-
renderBackground : Resources -> List Renderable
renderBackground resources =
    [ Render.parallaxScroll
        { z = -0.99
        , texture = Resources.getTexture "images/cloud_bg.png" resources
        , tileWH = ( 1, 1 )
        , scrollSpeed = ( 0.25, 0.25 )
        }
    , Render.parallaxScroll
        { z = -0.98
        , texture = Resources.getTexture "images/cloud_bg.png" resources
        , tileWH = ( 1.4, 1.4 )
        , scrollSpeed = ( 0.5, 0.5 )
        }
    ]
-}

renderMario : Resources -> Mario -> Renderable
renderMario resources { x, y, dir } =
    let
        d =
            if dir == Left then
                -1

            else
                1
    in
    Render.animatedSpriteWithOptions
        { position = ( x, y, 0 )
        , size = ( d * 0.3, 0.8 )
        , texture = Resources.getTexture "assets/playerIdle1.png" resources
        , bottomLeft = ( 0, 0 )
        , topRight = ( 1, 1 )
        , duration = 1
        , numberOfFrames = 11
        , rotation = 0
        , pivot = ( 0.5, 0 )
        }


view : Model -> { title : String, content : Html Msg }
view ({ time, screen } as model) =
  { title = "Game"
  , content =
      div [ Attr.style "overflow" "hidden", Attr.style "width" "100%", Attr.style "height" "100%" ]
        [ Game2d.render
          { camera = model.camera
          , time = time
          , size = screen
          }
          (render model)
        ]
  }

{-
main : Program () Model Msg
main =
    Browser.element
        { update = update
        , init = init
        , view = view
        , subscriptions = subs
        }
-}


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ --onResize ScreenSize
        Sub.map Keys Keyboard.subscriptions
        , onAnimationFrameDelta ((\dt -> dt / 1000) >> Tick)
        ]
