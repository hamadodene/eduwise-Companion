interface Credentials {
    username?: string;
    password?: string;
    token?: string;
}

class MoodleClient {

    token: string
    url: string
    service: string
    logger: any
    strictSSL: boolean

    constructor(options: Credentials & {
        url: string,
        logger?: any,
        service?: string,
        token?: string,
        strictSSL: boolean
    }) {
        this.url = options.url
        this.logger = options.logger || console
        this.service = options.service || 'moodle_mobile_app'
        this.token = options.token || null
        this.strictSSL = options.strictSSL || true
    }

    // To use when user provider username and password.
    // User can also pass token
    async authenticateClient(username: string, password: string): Promise<MoodleClient> {
        return new Promise(async (resolve, reject) => {
            this.logger.debug(`[init] requesting ${this.service} token from ${this.url}`)

            const queryParams = new URLSearchParams({
                username: username,
                password: password,
                service: this.service
            })

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            
            try {
                const response = await fetch(`${this.url}/login/token.php?${queryParams}`, options)
                const data = await response.json()

                if ('token' in data) {
                    this.token = data.token
                    this.logger.debug('[init] token obtained')
                    resolve(this)
                } else if ('error' in data) {
                    this.logger.error(`[init] authentication failed: ${data.error}`)
                    reject(new Error(`authentication failed: ${data.error}`))
                } else {
                    this.logger.error('[init] authentication failed: unexpected server response')
                    reject(new Error('authentication failed: unexpected server response'))
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    async call(options: { wsfunction: string, args?: object, method?: string, settings?: object }): Promise<any> {

        const wsfunction = options.wsfunction
        const args = options.args || {}
        const settings = options.settings || {}

        this.logger.debug("[call] calling web service function %s", wsfunction)

        const queryParams = new URLSearchParams({
            wstoken: this.token || '',
            wsfunction: wsfunction,
            moodlewsrestformat: 'json',
            ...args,
        })

        var requestOptions = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        try {
            const response = await fetch(`${this.url}/webservice/rest/server.php?${queryParams}`, requestOptions)
            const responseData = await response.json()
            return responseData
        } catch (error) {
            throw new Error(`Moodle API request failed: ${error.message}`)
        }
    }
}

export default MoodleClient