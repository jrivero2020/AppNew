import React from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import playaElSol from './assets/images/playaElSol.jpg'

const HolaMundo = () => {
    return (
        <BrowserRouter>
        <div>
            <h1>Hola mundo!</h1>
            <p> Ahora se escribe lo que uno quiera</p>
           <img src={playaElSol}></img>
        </div>
        </BrowserRouter>
    )
}
export default hot(module)(HolaMundo)