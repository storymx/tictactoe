/**
 * Created by Luis Gabriel Jaramillo 06-03-2018
 */

module.exports.statusOKSuccess = function(response,res){
    return res.status(200).json(response);
};

module.exports.statusOKSuccessWithMessage = function(message, response,res){
    return res.status(200).json({
        data:response,
        message:message,
        code:200,
        error:false
    });
};

module.exports.statusBadRequest = function(err,res){
    if(err){
        return res.status(400).json({
            message: 'HTTP ERROR 400 - BAD REQUEST',
            errorMessage:err,
            code:400,
            error: true
        });
    }else{
        return res.status(400).json({
            message: 'HTTP ERROR 400 - BAD REQUEST',
            code:400,
            error: true
        });
    }
};

module.exports.responseNotAuthorized = function(err,res){
    if(err){
        return res.status(401).json({
            message: 'HTTP ERROR 401 - UNAUTHORIZED ACTION',
            errorMessage: err,
            code:401,
            error: true
        });
    }else{
        return res.status(401).json({
            message: 'HTTP ERROR 401 - UNAUTHORIZED ACTION',
            code:401,
            error: true
        });
    }
};

module.exports.responsePaymentRequired = function(err,res){
    if(err){
        return res.status(402).json({
            message: 'HTTP ERROR 402 - PAYMENT REQUIRED',
            errorMessage: err,
            code:402,
            error: true
        });
    }else{
        return res.status(402).json({
            message: 'HTTP ERROR 402 - PAYMENT REQUIRED',
            code:402,
            error: true
        });
    }
};

module.exports.statusForbidden = function(err,res){
    if(err){
        return res.status(403).json({
            message: 'HTTP ERROR 403 - FORBIDDEN',
            errorMessage:err,
            code:403,
            error:true
        })
    }else{
        return res.status(403).json({
            message: 'HTTP ERROR 403 - FORBIDDEN',
            code:403,
            error: true
        });
    }
};

module.exports.statusNotFound = function(err,res){
    if(err){
        return res.status(404).json({
            message: 'HTTP ERROR 404 - NOT FOUND',
            errorMessage: err,
            code: 404,
            error: true
        });
    }else{
        return res.status(404).json({
            message: 'HTTP ERROR 404 - NOT FOUND',
            code: 404,
            error: true
        });
    }
};

module.exports.statusMethodNotAllowed = function(err,res){
    if(err){
        return res.status(405).json({
            message: 'HTTP ERROR 405 - METHOD NOT ALLOWED',
            errorMessage:err,
            code:405,
            error: true
        });
    }else {
        return res.status(405).json({
            message:'HTTP ERROR 405',
            code:405,
            error:true
        });
    }
};

module.exports.statusRequestTimeout = function(err,res){
    if(err){
        return res.status(408).json({
            message:'HTTP ERROR 408 - REQUEST TIMEOUT',
            errorMessage: err,
            code:408,
            error: true
        });
    }else{
        return res.status(408).json({
            message:'HTTP ERROR 408 - REQUEST TIMEOUT',
            code:408,
            error:true
        });
    }
};

module.exports.statusServerError = function(err,res){
    if(err){
        return res.status(500).json({
            message:'HTTP ERROR 500 - Server Internal Error.',
            errorMessage: err,
            code: 500,
            error:true
        });
    }else{
        return res.status(500).json({
            message: 'HTTP ERROR 500 - Server Internal Error.',
            code:500,
            error:true
        });
    }
};