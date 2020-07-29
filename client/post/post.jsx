/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import {
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import auth from '../auth/auth-helper';
import { remove } from './api-post';

const styles = (theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing(2)}px 0px`,
  },
  cardHeader: {
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
  },
  text: {
    margin: theme.spacing(2),
  },
  photo: {
    textAlign: 'center',
    backgroundColor: '#f2f5f4',
    padding: theme.spacing(),
  },
  media: {
    height: 200,
  },
  button: {
    margin: theme.spacing(),
  },
});

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      like: false,
      likes: 0,
      comments: [],
    };
  }

  deletePost = () => {
    const jwt = auth.isAuthenticated();
    remove(
      {
        postId: this.props.post._id,
      },
      {
        t: jwt.token,
      },
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.onRemove(this.props.post);
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={(
            <Avatar
              src={`/api/users/photo/${this.props.post.postedBy._id}`}
            />
          )}
          action={
            this.props.post.postedBy._id
              === auth.isAuthenticated().user._id && (
              <IconButton onClick={this.deletePost}>
                <DeleteIcon />
              </IconButton>
            )
          }
          title={(
            <Link
              to={`/user/${this.props.post.postedBy._id}`}
            >
              {this.props.post.postedBy.name}
            </Link>
          )}
          subheader={new Date(
            this.props.post.created,
          ).toDateString()}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Typography
            component="p"
            className={classes.text}
          >
            {this.props.post.text}
          </Typography>
          {this.props.post.photo && (
            <div className={classes.photo}>
              <img
                className={classes.media}
                src={`/api/posts/photo/${this.props.post._id}`}
                alt="post"
              />
            </div>
          )}
        </CardContent>
        <CardActions>
          {this.state.like ? (
            <IconButton
              onClick={this.like}
              className={classes.button}
              aria-label="Like"
              color="secondary"
            >
              <FavoriteIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={this.like}
              className={classes.button}
              aria-label="Unlike"
              color="secondary"
            >
              <FavoriteBorderIcon />
            </IconButton>
          )}
          <span> {this.state.likes} </span>
          <IconButton
            className={classes.button}
            aria-label="Comment"
            color="secondary"
          >
            <CommentIcon />
          </IconButton>
          <span>{this.state.comments.length}</span>
        </CardActions>
        <Divider />
        {/* <Comments */}
        {/*  postId={this.props.post._id} */}
        {/*  comments={this.state.comments} */}
        {/*  updateComments={this.updateComments} */}
        {/* /> */}
      </Card>
    );
  }
}

export default withStyles(styles)(Post);
