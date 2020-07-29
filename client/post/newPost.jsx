/* eslint-disable react/prop-types,jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { PhotoCamera } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import auth from '../auth/auth-helper';
import { create } from './api-post';

const styles = (theme) => ({
  root: {
    backgroundColor: '#efefef',
    padding: `${theme.spacing(3)}px 0px 1px`,
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(65, 150, 136, 0.09)',
    boxShadow: 'none',
  },
  cardContent: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 0,
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  photoButton: {
    height: 30,
    marginBottom: 5,
  },
  input: {
    display: 'none',
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: '100%',
  },
  submit: {
    margin: theme.spacing(2),
  },
  filename: {
    verticalAlign: 'super',
  },
});

class NewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      photo: '',
      error: '',
      user: {},
    };
  }

  componentDidMount = () => {
    this.postData = new FormData();
    this.setState({ user: auth.isAuthenticated().user });
  };

  clickPost = () => {
    const jwt = auth.isAuthenticated();
    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      this.postData,
    ).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ text: '', photo: '' });
        this.postData.delete('photo');
        this.props.addUpdate(data);
      }
    });
  };

  handleChange = (name) => (event) => {
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value;
    this.postData.set(name, value);
    this.setState({ [name]: value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardHeader
            avatar={(
              <Avatar
                src={`/api/users/photo/${this.state.user._id}`}
              />
            )}
            title={this.state.user.name}
            className={classes.cardHeader}
          />
          <CardContent className={classes.cardContent}>
            <TextField
              placeholder="Share your thoughts ..."
              multiline
              rows="3"
              value={this.state.text}
              onChange={this.handleChange('text')}
              className={classes.textField}
              margin="normal"
            />
            <input
              accept="image/*"
              onChange={this.handleChange('photo')}
              className={classes.input}
              id="icon-button-file"
              type="file"
            />
            <label htmlFor="icon-button-file">
              <IconButton
                color="secondary"
                className={classes.photoButton}
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
            <span className={classes.filename}>
              {this.state.photo
                ? this.state.photo.name
                : ''}
            </span>
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
              disabled={this.state.text === ''}
              onClick={this.clickPost}
              className={classes.submit}
            >
              POST
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(NewPost);