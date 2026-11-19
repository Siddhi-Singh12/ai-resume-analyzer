/* eslint-disable no-undef */

import jwt from 'jsonwebtoken'

const protect = async (req, res, next) => {
    let token

    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            token = authHeader.split(' ')[1]

            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({
                    message: 'Not Authorized',
                })
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'super_secret_key'
            )

            req.user = {
                ...decoded,
                id: decoded.id || decoded._id,
                _id: decoded.id || decoded._id,
            }

            next()

        } catch (error) {
            console.error('JWT Auth Middleware Error:', error.message)

            return res.status(401).json({
                message: 'Not Authorized',
            })
        }

    } else {
        return res.status(401).json({
            message: 'No Token',
        })
    }
}

export default protect