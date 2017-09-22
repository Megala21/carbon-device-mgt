/**
 * This class will hold the constants that to be used through-out the application.
 */
class Constants {
    constructor() {
        this.baseURL = window.location.origin;
        this.appContext = window.location.pathname.split("/")[1];
    }
}

export default (new Constants);