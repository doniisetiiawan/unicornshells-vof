import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import seashellImg from '../assets/images/seashell.jpg';
import auth from '../auth/auth-helper';
import FindPeople from '../user/findPeople';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(
      2.5,
    )}px ${theme.spacing(2)}px`,
    color: theme.palette.text.secondary,
  },
  media: {
    minHeight: 330,
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultPage: true,
    };
  }

  init = () => {
    if (auth.isAuthenticated()) {
      this.setState({ defaultPage: false });
    } else {
      this.setState({ defaultPage: true });
    }
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = () => {
    this.init();
  };

  componentDidMount = () => {
    this.init();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.state.defaultPage && (
          <Grid container spacing={1}>
            <Grid item xs={12}>
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
                    Welcome to the MERN Social home page.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {!this.state.defaultPage && (
          <Grid container spacing={1}>
            <Grid item xs={8} sm={7}>
              {/* <Newsfeed/> */}
            </Grid>
            <Grid item xs={6} sm={5}>
              <FindPeople />
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Home);

Home.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};
