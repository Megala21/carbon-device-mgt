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

import Theme from '../../theme';
import PropTypes from 'prop-types';
import Badge from 'material-ui/Badge';
import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {withRouter} from 'react-router-dom';
import AuthHandler from "../../api/authHandler";
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Apps from 'material-ui/svg-icons/navigation/apps';
import Add from 'material-ui/svg-icons/content/add-circle';
import Feedback from 'material-ui/svg-icons/action/feedback';
import DevicesOther from 'material-ui/svg-icons/hardware/devices-other';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import T from 'i18n-react';
import Locale from '../../locale';
import LocalizedStrings from 'react-localization';
import axios from 'axios';

/**
 * Base Layout:
 * App bar
 * Left Navigation
 * Middle content.
 * */
class BaseLayout extends Component {

    constructor() {
        super();
        this.state = {
            notifications: 0,
            user: 'Admin',
            locale : ""
        };
        this.scriptId = "basic-layout";
        this.logout = this.logout.bind(this);
        this.updateLocales = this.updateLocales.bind(this);
    }

    componentWillMount() {
        /**
         *Loading the theme files based on the the user-preference.
         */
        Theme.insertThemingScripts(this.scriptId);

        this.updateLocales();

    }

    updateLocales() {
        let config = Locale.loadConfigs();
        let strings;
        let localeJsons = {};

        config.then(data => {
            let mainObject = {},
                promises = [];

            data.data.i18n.forEach(function (singleElement) {
                promises.push(axios.get("https://localhost:9443/publisher/locales/" + singleElement + ".json",{
                    params: {
                        value: singleElement
                    }
                }))
            });

            axios.all(promises).then(results => {
                results.forEach(function (response) {
                    localeJsons[response.config.params.value] = response.data;
                });
                strings = new LocalizedStrings(localeJsons);
                strings.setLanguage(strings.getInterfaceLanguage());
                Locale.strings = strings;
                this.setState({
                    locale: strings
                })
            });

        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        Theme.removeThemingScripts(this.scriptId)
    }

    handleApplicationClick() {
        this.handleHistory('/assets/apps');
    }

    handleOverviewClick() {
        this.handleHistory('/overview');
    }

    handleApplicationCreateClick() {
        this.handleHistory('/assets/apps/create');
    }

    handlePlatformClick() {
        this.handleHistory('/assets/platforms');
    }

    handlePlatformCreateClick() {
        this.handleHistory('/assets/platforms/create');
    }

    handleReviewClick() {
        this.handleHistory('/assets/reviews');
    }

    /**
     * The method to update the history.
     * to: The URL to route.
     * */
    handleHistory(to) {
        this.props.history.push(to);
    }

    logout(event, index, value) {
        AuthHandler.logout();
    }

    render() {
        return (

            <div>
                <AppBar
                    title={this.state.locale.how}
                    iconElementRight={
                        <div>
                            <Badge
                                badgeContent={this.state.notifications}
                                secondary={true}
                                badgeStyle={{top: 12, right: 12}}
                            >
                                <IconButton tooltip="Notifications">
                                    <NotificationsIcon/>
                                </IconButton>
                            </Badge>
                            <IconMenu
                                iconButtonElement={<FlatButton
                                    icon={<ActionAccountCircle/>}
                                    label="sdfdsf"
                                />}
                                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                onChange={this.logout}
                            >
                                <MenuItem value={0} primaryText="Logout" />
                            </IconMenu>
                            {/*<FlatButton*/}
                                {/*icon={<ActionAccountCircle/>}*/}
                                {/*onClick={() => {console.log("Clicked")}}*/}
                                {/*label={this.props.user.getUserName()}*/}
                            {/*/>*/}
                        </div>
                    }
                />
                <div>
                    <Drawer containerStyle={{height: 'calc(100% - 64px)', width: '15%', top: '10%'}} open={true}>
                        <List>
                            <ListItem
                                primaryText="Applications"
                                leftIcon={<Apps/>}
                                initiallyOpen={false}
                                primaryTogglesNestedList={true}
                                onClick={this.handleApplicationClick.bind(this)}
                                nestedItems={[
                                    <ListItem
                                        key={1}
                                        primaryText="Create"
                                        onClick={this.handleApplicationCreateClick.bind(this)}
                                        leftIcon={<Add/>}
                                    />
                                ]}
                            />
                            <ListItem
                                primaryText="Platforms"
                                leftIcon={<DevicesOther/>}
                                initiallyOpen={false}
                                primaryTogglesNestedList={true}
                                onClick={this.handlePlatformClick.bind(this)}
                                nestedItems={[
                                    <ListItem
                                        key={1}
                                        primaryText="Create"
                                        onClick={this.handlePlatformCreateClick.bind(this)}
                                        leftIcon={<Add/>}
                                    />
                                ]}
                            />
                            <ListItem
                                primaryText="Reviews"
                                onClick={this.handleReviewClick.bind(this)}
                                leftIcon={<Feedback/>}
                            />
                        </List>
                    </Drawer>
                </div>
                <div className="basicLayoutDiv">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

BaseLayout.propTypes = {
    children: PropTypes.element
};

export default withRouter(BaseLayout);
