/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContainer from './tabContainer';
import FollowGrid from './followGrid';
import PostList from '../post/postList';

class ProfileTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = () => {
    this.setState({ tab: 0 });
  };

  handleTabChange = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    return (
      <>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.tab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Posts" />
            <Tab label="Following" />
            <Tab label="Followers" />
          </Tabs>
        </AppBar>
        {this.state.tab === 0 && (
          <TabContainer>
            <PostList
              removeUpdate={this.props.removePostUpdate}
              posts={this.props.posts}
            />
          </TabContainer>
        )}
        {this.state.tab === 1 && (
          <TabContainer>
            <FollowGrid
              people={this.props.user.following}
            />
          </TabContainer>
        )}
        {this.state.tab === 2 && (
          <TabContainer>
            <FollowGrid
              people={this.props.user.followers}
            />
          </TabContainer>
        )}
      </>
    );
  }
}

export default ProfileTabs;
