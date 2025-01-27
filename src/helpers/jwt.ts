

import jwt from 'jwt-simple'
import moment from 'moment'

const secret = 'S1nclave';

export const createToken = ( user: any ) => {

    const payload = {
        sub: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
        lat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    }

    return jwt.encode(payload, secret);

}
