import {Component} from 'react';
import isEqual from 'react-fast-compare';

class BaseComponent extends Component {
  shouldComponentUpdate(nextProps, nextState = {}) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }
}

export default BaseComponent;
