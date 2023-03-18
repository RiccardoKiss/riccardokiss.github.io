port module Ports exposing (..)

import Json.Encode as E


port storeLevel : E.Value -> Cmd msg
port storeTime : E.Value -> Cmd msg
port storePlayer : E.Value -> Cmd msg
