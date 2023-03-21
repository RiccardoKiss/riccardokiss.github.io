port module Ports exposing (..)

import Json.Encode as E


port storeLevel : E.Value -> Cmd msg
port storeGameTime : E.Value -> Cmd msg
port storePlayer : E.Value -> Cmd msg

--port receivePlayer : (Model -> msg) -> Sub msg
