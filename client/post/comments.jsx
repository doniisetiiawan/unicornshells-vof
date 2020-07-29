/* eslint-disable react/prop-types,react/no-array-index-key */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import auth from '../auth/auth-helper';
import { comment, uncomment } from './api-post';

const styles = (theme) => ({
  cardHeader: {
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
  },
  smallAvatar: {
    width: 25,
    height: 25,
  },
  commentField: {
    width: '100%',
  },
  commentText: {
    backgroundColor: 'white',
    padding: theme.spacing(),
    margin: `2px ${theme.spacing(2)}px 2px 2px`,
  },
  commentDate: {
    display: 'block',
    color: 'gray',
    fontSize: '0.8em',
  },
  commentDelete: {
    fontSize: '1.6em',
    verticalAlign: 'middle',
    cursor: 'pointer',
  },
});

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  addComment = (event) => {
    if (event.keyCode == 13 && event.target.value) {
      event.preventDefault();
      const jwt = auth.isAuthenticated();
      comment(
        {
          userId: jwt.user._id,
        },
        {
          t: jwt.token,
        },
        this.props.postId,
        { text: this.state.text },
      ).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: '' });
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  deleteComment = (comment) => {
    const jwt = auth.isAuthenticated();
    uncomment({
      userId: jwt.user._id,
    }, {
      t: jwt.token,
    }, this.props.postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  }

  render() {
    const { classes } = this.props;
    const commentBody = (item) => (
      <p className={classes.commentText}>
        <Link to={`/user/${item.postedBy._id}`}>
          {item.postedBy.name}
        </Link>
        <br />
        {item.text}
        <span className={classes.commentDate}>
          {new Date(item.created).toDateString()} |
          {auth.isAuthenticated().user._id
            === item.postedBy._id && (
            <Icon
              onClick={() => this.deleteComment(item)}
              className={classes.commentDelete}
            >
              delete
            </Icon>
          )}
        </span>
      </p>
    );

    return (
      <>
        <CardHeader
          avatar={(
            <Avatar
              className={classes.smallAvatar}
              src={`/api/users/photo/${
                auth.isAuthenticated().user._id
              }`}
            />
          )}
          title={(
            <TextField
              onKeyDown={this.addComment}
              multiline
              value={this.state.text}
              onChange={this.handleChange('text')}
              placeholder="Write something ..."
              className={classes.commentField}
              margin="normal"
            />
          )}
          className={classes.cardHeader}
        />
        {this.props.comments.map((item, i) => (
          <CardHeader
            avatar={(
              <Avatar
                src={`/api/users/photo/${item.postedBy._id}`}
              />
            )}
            title={commentBody(item)}
            className={classes.cardHeader}
            key={i}
          />
        ))}
      </>
    );
  }
}

export default withStyles(styles)(Comments);
