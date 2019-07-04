// grab form data when button is clicked

function login() {
    const username = $('.username').val();
    const password = $('.password').val();

    const loginParam = {
        username,
        password
    }

    console.log('Logging In')

    // send request with axios

    axios.post('http://localhost:3000/login', {
        loginParam
    }).then(response => {
        const loginData = response.data;

        if (loginData.auth === true ) {
            sessionStorage.setItem('authtoken', loginData.token);

            // remove current user name and set a new value for current user name, store in local storage

            sessionStorage.removeItem('currentUser');
            sessionStorage.setItem('currentUser', loginParam.username);

            window.location.replace("./dashboard.html");
        }
    }).catch(err => {
         console.log(err);
    })
}