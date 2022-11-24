function tokendata () {
    return { headers: {
        Authorization: "Bearer " + localStorage.usertoken
    }
    }
}

export {tokendata}