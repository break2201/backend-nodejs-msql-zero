
import { NextFunction, Request, Response } from 'express';
import jwt from 'jwt-simple';
import moment from 'moment';

const secret = 'S1nclave';

export const auth = ( req: any, resp: Response, next: NextFunction ) => {
    // console.log(req.headers);
    if( !req.headers.authorization ) {
        return resp.status(403).send({
            message: 'NoHeadersError'
        });
    }

    const token = req.headers.authorization.replace(/['']+/g,'');

    const segment = token.split('.');
    // console.log(token);
    // console.log(segment);
    if( segment.length != 3 ) {
        return resp.status(403).send({
            message: 'InvalidToken'
        });
    } else {
        try {
            var payload = jwt.decode( token, secret );
            // console.log(payload);
            if(payload.exp <= moment().unix() ) {
                return resp.status(403).send({
                    message: 'TokenExpirado'
                });
            }
        } catch (error) {
            return resp.status(403).send({
                message: 'InvalidToken'
            });
        }
    }

    req.user = payload;

    next();
}