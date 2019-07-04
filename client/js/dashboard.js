$(document).ready(function() {
    const sessionToken = sessionStorage.getItem('authtoken');

    if (sessionToken === null) {
        window.location.replace("./login.html");
    }

    $('.username').text(sessionStorage.getItem('currentUser'))
})

function logout() {
    // remove token from local storage
    sessionStorage.removeItem('authtoken');


    axios.get('http://localhost:3000/logout').then(response => {
        console.log(response);
    }).catch(err => {
        console.log(err);
    })

    window.location.replace("./login.html");
}