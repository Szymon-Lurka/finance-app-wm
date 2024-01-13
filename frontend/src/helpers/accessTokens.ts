const getInitialAccessToken = () => {
    const accessTokenStorageValue = localStorage.getItem('accessToken');
    const accessToken = accessTokenStorageValue != 'undefined' ? accessTokenStorageValue : null;
    return JSON.parse(accessToken)?.data || null;
}

const getInitialRefreshToken = () => {
    const refreshTokenStorageValue = localStorage.getItem('refreshToken');
    const refreshToken = refreshTokenStorageValue != 'undefined' ? refreshTokenStorageValue : null;
    return JSON.parse(refreshToken)?.data || null;
}

export {
    getInitialAccessToken,
    getInitialRefreshToken
}
