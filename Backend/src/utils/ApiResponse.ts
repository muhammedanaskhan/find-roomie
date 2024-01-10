class ApiResponse{
    public statusCode: number
    public data: null | any
    public message: string
    public success: any
    constructor(statusCode: number, data: null | any, message = "success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export {ApiResponse}