import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

function TabContainer(props) {
  return (
    <>
      <Typography
        component="div"
        style={{ padding: 8 * 2 }}
      >
        {props.children}
      </Typography>
    </>
  );
}

export default TabContainer;

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
