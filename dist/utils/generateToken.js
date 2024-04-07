import jwt from 'jsonwebtoken';
//jwt secret is generated using linux terminal using command: openssl rand -base64 60
const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    return token;
};
export { generateToken };
