$(document).ready(function() {
    const sessionToken = sessionStorage.getItem('authtoken');

    if (sessionToken === null) {
        window.location.replace("./login.html");
    }

    $('.username').text(sessionStorage.getItem('currentUser'))

    // send request to list all sports in the database

    axios.get('https://www.thesportsdb.com/api/v1/json/1/all_sports.php').then(response => {
        const responseArray = response.data.sports;

        let allSports = ``;

        responseArray.forEach(sport => {
            const sportName = sport.strSport

            const collectionItem = `<li class="list-item collection-item" onclick="viewLeagues()"><a onclick="viewLeagues()" class="white-text list-link">${sportName}</a></li>`

            allSports = allSports + collectionItem;
        })

        document.getElementById('all-sports-list').innerHTML = allSports;
    }).catch(err => {
        console.log(err)
    })

    // list all events in the next 24 hours
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

function viewLeagues() {
    const allLeagues = [];

    $( "#eventsView" ).html('<tr></tr>');

    $('.list-item').on('click', function(event) {
        event.preventDefault();
        $('.list-item').off('click');
        const sportName = $(this).text();
        const sportNameSlug =  sportName.replace(/ /g, '%20');

        console.log(sportName)

        axios.get(`https://www.thesportsdb.com/api/v1/json/1/search_all_leagues.php?&s=${sportNameSlug}`).then(response => {
            const responseArray = response.data.countrys;

            responseArray.forEach(oneresponse => {
                allLeagues.push(oneresponse)
            })
            
        }).then(function() {
            allLeagues.forEach(league => {

                let tomorrowFixtures = ``;
                const tomorrowDate = new Date()

                tomorrowDate.setDate(tomorrowDate.getDate() + 1);

                const tomorrowDateInit = tomorrowDate.getDate();

                const tomorrowMonthNum = tomorrowDate.getMonth() + 01;

                const tomorrowMonthStr = '0' + tomorrowMonthNum

               let tomorrowDayStr = '0' + tomorrowDate.getDate();

                if (tomorrowDayStr.length > 2) {
                    tomorrowDayStr = tomorrowDayStr.substr(1);
                }

                const tomorrowDateNum = tomorrowDate.getFullYear() + '-' + tomorrowMonthStr + '-' + tomorrowDayStr

                const leagueName = league.strLeague;

                const leagueNameHTML = `<h3 class ="league-name">${leagueName}</h3>`
                
                const leagueNameSlug =  leagueName.replace(/ /g, '_')

                axios.get(`https://www.thesportsdb.com/api/v1/json/1/eventsday.php?d=${tomorrowDateNum}&l=${leagueNameSlug}`).then(response => {
                    const tomorrowEvents = response.data.events;

                    let eventHTML = ``;

                    if (tomorrowEvents === null) {
                        $( "#eventsView" ).append( `<tr class="white-text one-event"><td>No ${leagueName} events tomorrow</td><td><b>${leagueName}</b></td><td><b>${sportName}</b></td></tr>` );
                    }

                    if (tomorrowEvents !== null) {
                        tomorrowEvents.forEach(event => {
                            const eventName = event.strEvent;

                            const leagueNameLower = leagueNameSlug.toLowerCase();
    
                            const eventNameHTML= `<tr class="white-text one-event"><td><b>${eventName}</b></td><td><b>${leagueName}</b></td><td><b>${sportName}</b></tr>`
    
                            tomorrowFixtures = tomorrowFixtures + eventNameHTML
                        })
                    }
                    
            $( "#eventsView" ).append(tomorrowFixtures);
            event.stopImmediatePropagation();
                }).catch(err => {
                    console.log(err);
                })
            })
        });
    })
}

function displayTomorrowEvents() {
    
    console.log('Getting Events')

    let upcomingFixtures = ``;

    const upcomingDate = new Date();

    upcomingDate.setDate(upcomingDate.getDate() + 1);

    const upcomingMonthNum = upcomingDate.getMonth() + 01;

    const upcomingMonthStr = '0' + upcomingMonthNum

    let upcomingDayStr = '0' + upcomingDate.getDate();

    if (upcomingDayStr.length > 2) {
        upcomingDayStr = upcomingDayStr.substr(1);
    }

    const upcomingDateNum = upcomingDate.getFullYear() + '-' + upcomingMonthStr + '-' + upcomingDayStr

    axios.get(`https://www.thesportsdb.com/api/v1/json/1/eventsday.php?d=${upcomingDateNum}`).then(response => {
        console.log('Sending requests')
        const responseArray = response.data.events;

        responseArray.forEach(oneresponse => {
            const eventName = oneresponse.strEvent;
            const sportName = oneresponse.strSport;
            const leagueName = oneresponse.strLeague;

            const eventsHTML= `<tr class="white-text one-event"><td><b>${eventName}</b></td><td><b>${leagueName}</b></td><td><b>${sportName}</b></td></tr>`
            
            upcomingFixtures = upcomingFixtures + eventsHTML;
        })
        console.log('Displaying events')
        console.log(upcomingFixtures)
        $( "#eventsView" ).append(upcomingFixtures);
        console.log('Done')
    }).catch(err => {
        console.log(err)
    })


}