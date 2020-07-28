import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import seashellImg from '../assets/images/seashell.jpg';

const styles = (theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px
${theme.spacing(2)}px`,
    color: theme.palette.text.secondary,
  },
  media: {
    minHeight: 330,
  },
});

function Home(props) {
  const { classes } = props;

  return (
    <>
      <Card className={classes.card}>
        <Typography
          type="headline"
          component="h2"
          className={classes.title}
        >
          Home Page
        </Typography>
        <CardMedia
          className={classes.media}
          image={seashellImg}
          title="Unicorn Shells"
        />
        <CardContent>
          <Typography type="body1" component="p">
            Welcome to the Mern Skeleton home page
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}

export default withStyles(styles)(Home);

Home.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};
