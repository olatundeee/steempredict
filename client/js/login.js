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
        console.log(response)
    }).catch(err => {
         console.log(err);
    })
}