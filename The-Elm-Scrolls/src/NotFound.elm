module NotFound exposing (view)

import Html exposing (Html)
--import Browser exposing (Document)


view : { title : String, content : Html msg }
view =
    { title = "NotFound"
    , content = Html.text ""
    }
