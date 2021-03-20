const jwt = require('jsonwebtoken');
const userAuth = (req, res, next) => {
    const header = req.headers['authorization'];
    if(header){
        const headerArray = header.split(' ');
        const token   = headerArray[1];
        req.token     = token;
        var jwtSecret = process.env.JWT_SECRET;
        jwt.verify(token,jwtSecret,(err,decoded) =>{
            if(err){
                res.status(400).json({result : false, message : "authorization failed"});
            }
            else{
                req.userId = decoded.id
                next();
            }
        })
        
    }
    else{
        res.status(400).json({result : false, message : "authorization failed"});
    }
    
}

module.exports.userAuth = userAuth;