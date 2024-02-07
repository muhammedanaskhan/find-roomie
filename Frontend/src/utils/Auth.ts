const isUserAuthenticated = () => {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken !== null && accessToken!== undefined && accessToken!== '';
}

export default isUserAuthenticated;