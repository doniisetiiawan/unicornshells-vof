/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Person, ArrowForward } from '@material-ui/icons';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { list } from './api-user';

const styles = (theme) => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(),
    margin: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
  },
});

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  componentDidMount = () => {
    list().then((data) => {
      if (data.error) console.log(data.error);
      else this.setState({ users: data });
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
            All Users
          </Typography>
          <List dense>
            {this.state.users.map((item, i) => (
              <Link to={`/user/${item._id}`} key={i}>
                <ListItem button="button">
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.name} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <ArrowForward />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Link>
            ))}
          </List>
        </Paper>
      </>
    );
  }
}

export default withStyles(styles)(Users);

Users.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};
