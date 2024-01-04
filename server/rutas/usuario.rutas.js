import {Router}     from 'express'
import usrCtrl      from '../controladores/usuario.control.js'
import authCtrl     from '../controladores/auth.control.js'
const router = Router()


// Rutas de Usuario 

router.route('/usuario')
    .get(  usrCtrl.listaUsuarios)
    .post( usrCtrl.crearUsuario )


router.route('/inscripcionUsuario')
    .post( usrCtrl.inscripcionUsuario )

router.route('/usuario/:Id')
    .get(authCtrl.requireSignin,    authCtrl.estaAutorizado, usrCtrl.leerUsuario)
    .put(authCtrl.requireSignin,    authCtrl.estaAutorizado, usrCtrl.updateUsuario)
    .delete(authCtrl.requireSignin, authCtrl.estaAutorizado, usrCtrl.deleteUsuario)

router.param('Id', usrCtrl.userByID)



export default router
