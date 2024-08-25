const getJwt = () => {
    return document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];
};

export default getJwt;