
import bcrypt from 'bcrypt-nodejs'

const encryptPassword = async ( password: string ): Promise<string> => {

    return new Promise((resolve: any, reject: any) => {
        
        bcrypt.hash( password, '', null, ( err, hash ) => {

            if( err ) reject( err )

            resolve( hash )

        })
    
    })

}

const comparePassword = async ( password1: string, password2: string ): Promise<boolean> => {

    return new Promise((resolve: any, reject: any) => {

        bcrypt.compare(password1, password2, async (res: any, check: any) => {

            if( !check ) resolve(false)

            resolve(true)

        })
        
    })

}

export default {
    encryptPassword,
    comparePassword
}