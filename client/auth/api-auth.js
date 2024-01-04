const signin = async (user) => {
    try {
        let response = await fetch('/auth/signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-TYpe': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        })

        let msgRet = await response.json()
        
        if (response.ok) {
            return msgRet
        } else {
            throw new Error(msgRet.message)
        }
    } catch (err) {
        return ({ error: err.message, message: err.message })
    }
}

const signout = async () => {
    try {
        let response = await fetch('/auth/signout', { method: 'GET' })
        let msgRet = await response.json()
        if (response.ok) {
            return msgRet
        } else {
            throw new Error(msgRet.message)
        }        
    } catch (err) {
        return ({ error: err.message, message: err.message })
    }
}

export { signin, signout }