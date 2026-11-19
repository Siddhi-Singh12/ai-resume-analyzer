/* eslint-disable no-undef */

import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || 'super_secret_key',
        {
            expiresIn: '7d',
        }
    )
}

export default generateToken