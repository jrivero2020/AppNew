import { Usuarios } from '../modelos/usuario.js'
import jwt from 'jsonwebtoken'
import { expressjwt } from 'express-jwt'
import { jwtConfig } from '../../config/config.js'

const signin = async (req, res) => {
    
    const { NombreUsuario, password } = req.body
    try {
        const usrFind = await Usuarios.findOne({ where: { NombreUsuario } });
        if (usrFind === null)
            return res.status(404).json({ message: 'Usuario no existe' })

        let valida = await usrFind.validaPassword(password)
        if (!valida)
            return res.status(401).json({ message: 'Usuario y clave no coinciden' })

        // Jwt
        const user = {
            _id: usrFind.idUsuario,
            _rol: usrFind.rol
        }

        const token = jwt.sign({ user }, jwtConfig.jwtSecret)
        res.cookie('t', token, { expire: new Date() + 20 })
        console.log( 'Token: ', token)
        return res.json({ token, user })
    } catch (error) {
        console.log("El Error: ", error)
        return res.status(400).json({ message: '*** No pude encontrar el registro***' })
        
    }
}

const signout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({ message: "Sesión terminada" })
}

const requireSignin = expressjwt({
    secret: jwtConfig.jwtSecret,
    userProperty: 'auth',
    algorithms: ['HS256']
})

const estaAutorizado = async (req, res, next) => {
    console.log("*****************estaAutorizado*******************")
    var usrRol = null
    try {
        let findUsrRol = await Usuarios.findByPk(req.auth.user._id)
        if (findUsrRol){
            usrRol = findUsrRol.rol
        }else{
            res.status(404).json({ message: 'Usuario que consulta ya no es válido' + error })
        }
    } catch (error) {
        res.status(404).json({ message: 'No pude conectar con BD. Usuario ' + error })
    }
    console.log(req.profile.idUsuario, req.auth.user._id, "usrRol: ", usrRol, "req.auth.user._rol", req.auth.user._rol)
    const autorizado = (req.profile && req.auth.user && req.profile.idUsuario == req.auth.user._id) || usrRol == 1
    if (!autorizado) {
        return res.status(403).json({ message: "Usuario no está autorizado" })
    }
    next()
}

export default { signin, signout, requireSignin, estaAutorizado }

