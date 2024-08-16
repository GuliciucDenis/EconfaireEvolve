import {Routes,Route } from "react-router-dom";
import login from "../../pages/login"

import React from 'react'

function routingcmponent() {
  return (
    <Routes>
        <Route path="/login" index element={login}></Route>
    </Routes>
  )
}

export default routingcmponent