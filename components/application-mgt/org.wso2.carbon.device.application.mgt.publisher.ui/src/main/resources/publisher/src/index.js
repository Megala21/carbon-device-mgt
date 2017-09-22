/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import './index.css';
import React from 'react';
import Publisher from './App';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {IntlProvider, defineMessages} from 'react-intl';
import httpClient from './httpClient';

const defaultLocale = "en";
const possibleLocale = navigator.language || defaultLocale;
const localesDirectory = "locales";
let promisedLocaleFile = httpClient.makeGetRequest(localesDirectory + "/" + possibleLocale + ".json");

promisedLocaleFile.then(response => {
    const messages = defineMessages(response.data);
    ReactDOM.render(<IntlProvider locale={possibleLocale} messages = {messages}><Publisher/></IntlProvider>,
        document.getElementById('root'));
    registerServiceWorker();
}).catch(error => {
    console.log(error);
    let promisedDefaultLocaleFile = httpClient.makeGetRequest(localesDirectory + "/" + defaultLocale + ".json");
    promisedDefaultLocaleFile.then(response => {
        const messages = defineMessages(response.data);
        ReactDOM.render(<IntlProvider locale={defaultLocale} messages = {messages}><Publisher/></IntlProvider>,
            document.getElementById('root'));
        registerServiceWorker();
    }).catch(error =>{
        console.log(error);
        console.error("Default locale file does not exist in the server. Please contact the server administrator");
    });
});

