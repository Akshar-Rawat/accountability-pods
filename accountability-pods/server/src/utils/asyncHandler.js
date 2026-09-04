const asyncHandler= (fn)=>async(req,res,next)=>{
try {
    await fn(req,res,next)
} catch (error) {
    const statusCode = error.statusCode || (error.code === 11000 ? 409 : 500);
    res.status(statusCode).json({
        message:error.message,
        success:false
    })
    
}
}
export {asyncHandler}
