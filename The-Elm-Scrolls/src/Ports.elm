port module Ports exposing (..)

import Json.Encode as E


port storeSave1 : E.Value -> Cmd msg
port storeSave2 : E.Value -> Cmd msg
port storeSave3 : E.Value -> Cmd msg

port storeLevel : E.Value -> Cmd msg
port storeGameTime : E.Value -> Cmd msg
port storePlayer : E.Value -> Cmd msg

--port receivePlayer : (Model -> msg) -> Sub msg
