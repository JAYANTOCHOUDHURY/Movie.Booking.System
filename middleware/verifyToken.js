const jwt = require('jsonwebtoken');

const verifyToken = function(req, res, next){

    console.log(`req.headers.authorization: ${req.headers.authorization}`);
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "Access Denied. No token provided."})
    }
    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();

    }
    catch(err){
        res.status(403).json({message: "Invalid or expire token", err: err.message});
    }
};

module.exports = {
    verifyToken
}