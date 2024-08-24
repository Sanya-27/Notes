export default {
    SUCCESS : (data:string | object) => ({
        code : 200,
        data,
    }),
    NOT_FOUND_ERR : (status:string) => ({
        code : 404,
        status,
    }),
    BAD_REQUEST : (status:string) => ({
        code : 400,
        status,
    }),
    UNAUTHORISED : (status:string) => ({
        code : 401,
        status,
    }),
    CONFLICT : (status:string) => ({
        code : 409,
        status,
    }),
}