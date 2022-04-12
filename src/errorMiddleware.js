"use strict";

module.exports = (err,req,res,next)=>{
    const httpStatus = err.status || 500;

    return res.status(httpStatus).send({
        status: httpStatus,
        message: err.message || "Error interno del servidor"
    });
}