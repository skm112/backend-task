
exports.error = {
    FIELD_NOT_PRESENT: (field) => `${field} not present/empty in api request.`,
    ALREADY_EXIST: "Record already exist.",
    ALREADY_DELETED: "Record already deleted.",
    NOT_FOUND: "Record not found.",
    TOKEN_EXPIRED: "Token expired.",
    INCORRECT_PASSWORD: "Password not matched.",
    REQUIRED_FIELD: "Please fill require fields.",
    TRY_AGAIN: "Something went wrong, Please try after sometime.",
    NOT_VALID_ID: "_id is invalid.",
    UNAUTHORIZED: "Authentication failed.",
    UNIQUE_POST: "Please use unique title.",
    UNAUTHORIZED_ACTION:"Current login user not authorized to take action on this post."

}

exports.success = {
    ACCOUNT_CREATED: "Account created successfully.",
    LOGIN_SUCCESS: "Login successfully.",
    LOGOUT_SUCCESS: "Logout successfully.",
    AUTHORIZED_USER: "User is authorized.",
    SAVE: "Record saved successfully.",
    UPDATE: "Record update successfully.",
    DELETED: "Record deleted successfully.",

}