const getInitialAccessToken = () => {
    const accessTokenStorageValue = localStorage.getItem('accessToken');
    const accessToken = accessTokenStorageValue != 'undefined' ? accessTokenStorageValue : null;
    console.log(JSON.parse(accessToken));
    return JSON.parse(accessToken)?.data || null;
}

export {
    getInitialAccessToken
}
