/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { follow, unfollow } from './api-user';

class FollowProfileButton extends Component {
  followClick = () => {
    this.props.onButtonClick(follow);
  };

  unfollowClick = () => {
    this.props.onButtonClick(unfollow);
  };

  render() {
    return (
      <>
        {this.props.following ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={this.unfollowClick}
          >
            Unfollow
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={this.followClick}
          >
            Follow
          </Button>
        )}
      </>
    );
  }
}

export default FollowProfileButton;
