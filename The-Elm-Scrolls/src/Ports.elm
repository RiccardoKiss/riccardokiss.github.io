port module Ports exposing (..)

import Json.Encode as E


port storeSave1 : E.Value -> Cmd msg
port storeSave2 : E.Value -> Cmd msg
port storeSave3 : E.Value -> Cmd msg

port loadedLoadGame : () -> Cmd msg
port reloadLoadGame : (Bool -> msg) -> Sub msg
--port reloadGame : (Model -> msg) -> Sub msg
