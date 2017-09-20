import axios from 'axios';
import LocalizedStrings from 'react-localization';

/**
 * This class will read through the configuration file and saves the theme names for the usage in other files.
 * User can define the themes in the config.json. The themes will be loaded based on the user preference.
 */
class Locale {
    constructor() {
        this.loadConfigs = this.loadConfigs.bind(this);
        this.strings = "";
    }

    loadLocaleFiles (path) {
        let httpClient = axios.create({
            baseURL: "https://localhost:9443/publisher/locales/" + path + ".json",
            timeout: 2000
        });
        return httpClient.get();
    }

    loadConfigs () {
        let httpClient = axios.create({
            baseURL: "https://localhost:9443/publisher/config.json",
            timeout: 2000
        });
        httpClient.defaults.headers.post['Content-Type'] = 'application/json';
        return httpClient.get();
    }


}

export default (new Locale);