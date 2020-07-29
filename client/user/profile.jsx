/* eslint-disable react/prop-types,react/no-access-state-in-setstate */
import React, { Component } from 'react';
import {
  Link,
  Redirect,
  withRouter,
} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Edit } from '@material-ui/icons';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import auth from '../auth/auth-helper';
import { read } from './api-user';
import DeleteUser from './deleteUser';
import FollowProfileButton from './followProfileButton';
import ProfileTabs from './profileTabs';
import { listByUser } from '../post/api-post';

const styles = (theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.protectedTitle,
    fontSize: '1em',
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10,
  },
});

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      redirectToSignin: false,
      following: false,
      posts: [],
    };
  }

  init = (userId) => {
    const jwt = auth.isAuthenticated();
    read({ userId }, { t: jwt.token }).then((data) => {
      if (data.error) this.setState({ redirectToSignin: true });
      else {
        const following = this.checkFollow(data);
        this.setState({ user: data, following });
        this.loadPosts(data._id);
      }
    });
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = (props) => {
    this.init(props.match.params.userId);
  };

  componentDidMount = () => {
    this.init(this.props.match.params.userId);
  };

  checkFollow = (user) => {
    const jwt = auth.isAuthenticated();
    return user.followers.find(
      (follower) => follower._id == jwt.user._id,
    );
  };

  clickFollowButton = (callApi) => {
    const jwt = auth.isAuthenticated();
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      this.state.user._id,
    ).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({
          user: data,
          following: !this.state.following,
        });
      }
    });
  };

  loadPosts = (user) => {
    const jwt = auth.isAuthenticated();
    listByUser(
      {
        userId: user,
      },
      {
        t: jwt.token,
      },
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  removePost = (post) => {
    const updatedPosts = this.state.posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    this.setState({ posts: updatedPosts });
  }

  render() {
    const { classes } = this.props;
    const photoUrl = this.state.user._id
      ? `/api/users/photo/${
        this.state.user._id
      }?${new Date().getTime()}`
      : '/api/users/defaultphoto';
    const { redirectToSignin } = this.state;
    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }

    return (
      <>
        <Paper className={classes.root} elevation={4}>
          <Typography
            type="title"
            className={classes.title}
          >
            Profile
          </Typography>
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  src={photoUrl}
                  className={classes.bigAvatar}
                />
              </ListItemAvatar>
              <ListItemText
                primary={this.state.user.name}
                secondary={this.state.user.email}
              />

              {auth.isAuthenticated().user
              && auth.isAuthenticated().user._id
                === this.state.user._id ? (
                  <ListItemSecondaryAction>
                    <Link
                      to={`/user/edit/${this.state.user._id}`}
                    >
                      <IconButton
                        aria-label="Edit"
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Link>
                    <DeleteUser
                      userId={this.state.user._id}
                    />
                  </ListItemSecondaryAction>
                ) : (
                  <FollowProfileButton
                    following={this.state.following}
                    onButtonClick={this.clickFollowButton}
                  />
                )}
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={this.state.user.about}
                secondary={`Joined: ${new Date(
                  this.state.user.created,
                ).toDateString()}`}
              />
            </ListItem>
          </List>
          <ProfileTabs
            user={this.state.user}
            posts={this.state.posts}
            removePostUpdate={this.removePost}
          />
        </Paper>
      </>
    );
  }
}

export default withStyles(styles)(withRouter(Profile));
