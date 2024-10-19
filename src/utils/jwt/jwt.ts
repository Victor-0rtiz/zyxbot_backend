
import * as jwt from 'jsonwebtoken';

export default class Json_webtoken {
    static sign(payload) {
        const options: jwt.SignOptions = {
            algorithm: process.env.JWT_ALGORITM as jwt.Algorithm,
            expiresIn: '1d',
        };
        return jwt.sign(payload, process.env.PRIVATE_KEY, options);
    }

    static verify(token) {
        token = token.replace(/^Bearer\s+/, "");
        const verifyOptions: jwt.VerifyOptions = {
            algorithms: [process.env.JWT_ALGORITM as jwt.Algorithm]
        }


        const decoded = jwt.verify(token, process.env.PUBLIC_KEY, verifyOptions);
        if (!decoded) return false;

        return decoded;
    }
};


