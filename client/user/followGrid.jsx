/* eslint-disable react/prop-types,react/no-array-index-key */
import React from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  gridList: {
    width: 500,
    height: 220,
  },
  tileText: {
    textAlign: 'center',
    marginTop: 10,
  },
});

function FollowGrid(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <GridList
        cellHeight={160}
        className={classes.gridList}
        cols={4}
      >
        {props.people.map((person, i) => (
          <GridListTile style={{ height: 120 }} key={i}>
            <Link to={`/user/${person._id}`}>
              <Avatar
                src={`/api/users/photo/${person._id}`}
                className={classes.bigAvatar}
              />
              <Typography className={classes.tileText}>
                {person.name}
              </Typography>
            </Link>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

export default withStyles(styles)(FollowGrid);
