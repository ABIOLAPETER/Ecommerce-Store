// Not found

export const notFound = (req,res,next)=>{
    const error = new Error(`Not Fournd : ${req.originalUrl}`)
    res.status(404)
    next(error);
}

// Error Handler

export const errorHandler = (err, req, res, next)=>{
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message:err?.message,
        stack:err?.stack,
    })
}