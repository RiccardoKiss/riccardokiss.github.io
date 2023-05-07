port module Ports exposing (..)

import Json.Encode as E


port storeSave1 : E.Value -> Cmd msg
port storeSave2 : E.Value -> Cmd msg
port storeSave3 : E.Value -> Cmd msg

port loadedPage : () -> Cmd msg
port reloadPage : (Bool -> msg) -> Sub msg

port storeSettings : E.Value -> Cmd msg
