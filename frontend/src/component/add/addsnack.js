import React, { Component } from 'react';
import Add from './add';

class Addsnack extends Component {
  render() {
    return (
      <React.Fragment>
          <Add
              name="snack_name"
              path_add="snack" />
      </React.Fragment>
    );
  }
}

export default Addsnack;