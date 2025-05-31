function authrorizedRole(...allowedRoles){
    return function (req, res, next){
        const userRole = req.users?.role;
        if(!allowedRoles.includes(userRole)){
            return res.status(403).json({message: "Access Denied: You don't have that permission"});
        }
        next();
    };
}
module.exports = authrorizedRole;