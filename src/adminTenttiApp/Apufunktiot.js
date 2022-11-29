const SERVER = 'https://localhost:4000';

function getServer() {
    return SERVER
}
function getTokendata () {
    return { headers: {
        Authorization: "Bearer " + localStorage.usertoken
    }
    }
}

export {getTokendata, getServer}