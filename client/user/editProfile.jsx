/* eslint-disable react/prop-types,jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { AttachFile as FileUpload } from '@material-ui/icons';
import auth from '../auth/auth-helper';
import { read, update } from './api-user';

const styles = (theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
  },
  error: {
    verticalAlign: 'middle',
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 300,
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
});

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      redirectToProfile: false,
      error: '',
      about: '',
      photo: '',
    };
  }

  componentDidMount = () => {
    this.userData = new FormData();
    const jwt = auth.isAuthenticated();
    read(
      {
        userId: this.props.match.params.userId,
      },
      { t: jwt.token },
    ).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
  };

  clickSubmit = () => {
    const jwt = auth.isAuthenticated();
    const user = {
      name: this.state.name || undefined,
      email: this.state.email || undefined,
      password: this.state.password || undefined,
      about: this.state.about || undefined,
    };
    update(
      {
        userId: this.props.match.params.userId,
      },
      {
        t: jwt.token,
      },
      this.userData,
    ).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({
          userId: data._id,
          redirectToProfile: true,
        });
      }
    });
  };

  handleChange = (name) => (event) => {
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value;
    this.userData.set(name, value);
    this.setState({ [name]: value });
  };

  render() {
    const { classes } = this.props;
    if (this.state.redirectToProfile) {
      return <Redirect to={`/user/${this.state.userId}`} />;
    }

    return (
      <>
        <Card className={classes.card}>
          <CardContent>
            <Typography
              type="headline"
              component="h2"
              className={classes.title}
            >
              Edit Profile
            </Typography>
            <input
              accept="image/*"
              type="file"
              onChange={this.handleChange('photo')}
              style={{ display: 'none' }}
              id="icon-button-file"
            />
            <label htmlFor="icon-button-file">
              <Button
                variant="contained"
                color="default"
                component="span"
              >
                Upload <FileUpload />
              </Button>
            </label>
            <span className={classes.filename}>
              {this.state.photo
                ? this.state.photo.name
                : ''}
            </span>
            <br />
            <TextField
              id="name"
              label="Name"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
            />
            <br />
            <TextField
              id="multiline-flexible"
              label="About"
              multiline
              rows="2"
              className={classes.textField}
              value={this.state.about}
              onChange={this.handleChange('about')}
            />
            <br />
            <TextField
              id="email"
              type="email"
              label="Email"
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange('email')}
              margin="normal"
            />
            <br />
            <TextField
              id="password"
              type="password"
              label="Password"
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange('password')}
              margin="normal"
            />
            <br />
            {this.state.error && (
              <Typography component="p" color="error">
                <Icon
                  color="error"
                  className={classes.error}
                >
                  error
                </Icon>
                {this.state.error}
              </Typography>
            )}
          </CardContent>
          <CardActions>
            <Button
              color="primary"
              variant="contained"
              onClick={this.clickSubmit}
              className={classes.submit}
            >
              Submit
            </Button>
          </CardActions>
        </Card>
      </>
    );
  }
}

export default withStyles(styles)(withRouter(EditProfile));
