class ApiError extends Error {
    public statusCode: number;
    public data: null | any;
    public success: boolean;
    public errors: any[];
    constructor(
        statusCode: number,
        message = "something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}