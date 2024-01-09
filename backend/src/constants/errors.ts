const errors = {
    auth: {
        register: 'Lack of all necessary data for registration.',
        password: 'Password need to be minimum eight characters, at least one letter, one number and one special character',
        login: 'Incorrect data. Login failed.',
        refreshToken: 'Invalid refresh token. Access denied.',
        invalidToken: 'Token is not valid',
        tokenIsValidUserNotExists: 'The user using this token no longer exists'
    }
} as const;

export default errors;
