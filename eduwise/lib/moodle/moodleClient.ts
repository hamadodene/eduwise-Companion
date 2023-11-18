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
        strictSSL?: boolean
    }) {
        this.url = options.url
        this.logger = options.logger || console
        this.service = options.service || 'moodle_mobile_app'
        this.strictSSL = options.strictSSL || true
        if (options.token) {
            this.token = options.token
        } else if (options.username && options.password) {
            // try to get token
            this.authenticateClient(options.username, options.password)
        } else {
            // credentials is null
            // failling is handle in another point
            this.token = null
        }
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

    async download(options: { filepath: string }): Promise<any> {
        if (!("filepath" in options)) {
            return Promise.reject("missing file path to download");
        }
        const queryParams = new URLSearchParams({
            token: this.token,
            file: options.filepath
        })
        var uri: string = this.url + `/webservice/pluginfile.php?${queryParams}`

        var request_options = {
            method: "GET"
        }
        try {
            const response = await fetch(uri, request_options)
            const result = await response.blob()
            return result
        } catch (error) {
            throw new Error(`Moodle download API request failed: ${error.message}`)
        }
    }
}

export default MoodleClient