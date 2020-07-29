/* eslint-disable react/no-access-state-in-setstate,react/prop-types */
import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import PostList from './postList';
import auth from '../auth/auth-helper';
import { listNewsFeed } from './api-post';
import NewPost from './newPost';

const styles = (theme) => ({
  card: {
    margin: 'auto',
    paddingTop: 0,
    paddingBottom: theme.spacing(3),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(
      2.5,
    )}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    fontSize: '1em',
  },
  media: {
    minHeight: 330,
  },
});

class Newsfeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
    };
  }

  loadPosts = () => {
    const jwt = auth.isAuthenticated();
    listNewsFeed(
      {
        userId: jwt.user._id,
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

  componentDidMount = () => {
    this.loadPosts();
  };

  addPost = (post) => {
    const updatedPosts = this.state.posts;
    updatedPosts.unshift(post);
    this.setState({ posts: updatedPosts });
  };

  removePost = (post) => {
    const updatedPosts = this.state.posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    this.setState({ posts: updatedPosts });
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <Card className={classes.card}>
          <Typography
            type="title"
            className={classes.title}
          >
            Newsfeed
          </Typography>
          <Divider />
          <NewPost addUpdate={this.addPost} />
          <Divider />
          <PostList
            removeUpdate={this.removePost}
            posts={this.state.posts}
          />
        </Card>
      </>
    );
  }
}

export default withStyles(styles)(Newsfeed);