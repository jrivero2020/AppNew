import { config }  from './../config/config.js';
import app         from './express'
import {sequelize} from './bdatos/bdatos.js'


async function main(){
    try{
        //await sequelize.sync( {alter: true}) // actualiza cualquier cambio en la estructura

        console.log('Usando alter: true==> la estructura ante cualquier cambio')
        app.listen( config.nodeport) 
        
    }catch(e){
        console.log(' *************  No pude conectarme a MySql ************=>>>', e)
    }
}

main()