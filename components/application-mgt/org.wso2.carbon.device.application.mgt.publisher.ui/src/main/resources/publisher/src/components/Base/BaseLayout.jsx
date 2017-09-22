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
import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

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
            user: 'Admin'
        };
        this.scriptId = "basic-layout";
        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
        /**
         *Loading the theme files based on the the user-preference.
         */
        Theme.insertThemingScripts(this.scriptId);
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
        const InternationalizedAppBar = injectIntl(({publisherTitle, notification, logoutMessage, intl}) => (
            <AppBar title={intl.formatMessage({id : publisherTitle})}
                iconElementRight={
                    <div>
                        <Badge badgeContent={this.state.notifications} secondary={true}
                               badgeStyle={{top: 12, right: 12}}>
                            <IconButton tooltip={intl.formatMessage({id : notification})}>
                                <NotificationsIcon/>
                            </IconButton>
                        </Badge>
                        <IconMenu
                            iconButtonElement={<FlatButton icon={<ActionAccountCircle/>} label="admin"/>}
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onChange={this.logout}>
                            <MenuItem value={0} primaryText={intl.formatMessage({id : logoutMessage})} />
                        </IconMenu>
                    </div>
                }/>
        ));

        const InternationalizedApplicationListItem = injectIntl(({parentPrimaryText,nestedPrimaryText, intl}) => (
            <ListItem
                primaryText={intl.formatMessage({id : parentPrimaryText})}
                leftIcon={<Apps/>}
                initiallyOpen={false}
                primaryTogglesNestedList={true}
                onClick={this.handleApplicationClick.bind(this)}
                nestedItems={[
                    <ListItem
                        key={1}
                        primaryText={intl.formatMessage({id : nestedPrimaryText})}
                        onClick={this.handleApplicationCreateClick.bind(this)}
                        leftIcon={<Add/>}
                    />
                ]}
            />
        ));

        const InternationalizedPlatformListItem = injectIntl(({parentPrimaryText,nestedPrimaryText, intl}) => (
            <ListItem
                primaryText={intl.formatMessage({id : parentPrimaryText})}
                leftIcon={<DevicesOther/>}
                initiallyOpen={false}
                primaryTogglesNestedList={true}
                onClick={this.handlePlatformClick.bind(this)}
                nestedItems={[
                    <ListItem
                        key={1}
                        primaryText={intl.formatMessage({id : nestedPrimaryText})}
                        onClick={this.handlePlatformCreateClick.bind(this)}
                        leftIcon={<Add/>}
                    />
                ]}
            />
        ));

        const InternationalizedReviewListItem = injectIntl(({parentPrimaryText,intl}) => (
            <ListItem
                primaryText={intl.formatMessage({id : parentPrimaryText})}
                onClick={this.handleReviewClick.bind(this)}
                leftIcon={<Feedback/>}
            />
        ));

        return (

            <div>
                <InternationalizedAppBar publisherTitle = "App.Publisher" notification = "notification"
                                         logoutMessage = "logout"/>
                <div>
                    <Drawer containerStyle={{height: 'calc(100% - 64px)', width: '15%', top: '10%'}} open={true}>
                        <List>
                          <InternationalizedApplicationListItem parentPrimaryText = "Applications" nestedPrimaryText = "Create"/>
                          <InternationalizedPlatformListItem parentPrimaryText = "Platforms" nestedPrimaryText = "Create" />
                          <InternationalizedReviewListItem parentPrimaryText = "Reviews"/>
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
