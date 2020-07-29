/* eslint-disable react/no-access-state-in-setstate,react/prop-types,react/no-array-index-key */
import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Pageview } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { findPeople, follow } from './api-user';
import auth from '../auth/auth-helper';

const styles = (theme) => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(),
    margin: 0,
  }),
  title: {
    margin: `${theme.spacing(
      3,
    )}px ${theme.spacing()}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    fontSize: '1em',
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  follow: {
    right: theme.spacing(2),
  },
  snack: {
    color: theme.palette.protectedTitle,
  },
  viewButton: {
    verticalAlign: 'middle',
  },
});

class FindPeople extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      open: false,
    };
  }

  componentDidMount = () => {
    const jwt = auth.isAuthenticated();
    findPeople(
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
        this.setState({ users: data });
      }
    });
  };

  clickFollow = (user, index) => {
    const jwt = auth.isAuthenticated();
    follow(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      user._id,
    ).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        const toFollow = this.state.users;
        toFollow.splice(index, 1);
        this.setState({
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}!`,
        });
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <Paper className={classes.root} elevation={4}>
          <Typography
            type="title"
            className={classes.title}
          >
            Who to follow
          </Typography>
          <List>
            {this.state.users.map((item, i) => (
              <span key={i}>
                <ListItem>
                  <ListItemAvatar
                    className={classes.avatar}
                  >
                    <Avatar
                      src={`/api/users/photo/${item._id}`}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={item.name} />
                  <ListItemSecondaryAction
                    className={classes.follow}
                  >
                    <Link to={`/user/${item._id}`}>
                      <IconButton
                        variant="raised"
                        color="secondary"
                        className={classes.viewButton}
                      >
                        <Pageview />
                      </IconButton>
                    </Link>
                    <Button
                      aria-label="Follow"
                      variant="contained"
                      color="primary"
                      onClick={() => this.clickFollow(item, i)}
                    >
                      Follow
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </span>
            ))}
          </List>
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.open}
          onClose={this.handleRequestClose}
          autoHideDuration={6000}
          message={(
            <span className={classes.snack}>
              {this.state.followMessage}
            </span>
          )}
        />
      </>
    );
  }
}

export default withStyles(styles)(FindPeople);
