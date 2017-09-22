import axios from 'axios';
import constants from './constants'

class httpClient{

    static makeGetRequest(path) {
        let httpClient = axios.create({
            baseURL: constants.baseURL + "/" + constants.appContext + "/" + path
        });
        return httpClient.get();
    }
}

export default (httpClient);