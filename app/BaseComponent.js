import React, {
    Component
} from 'react';
import Immutable from 'immutable';

class BaseComponent extends Component {

    shouldComponentUpdate(nextProps, nextState = {}) {
        return !Immutable.is(Immutable.fromJS(this.props), Immutable.fromJS(nextProps))
        || !Immutable.is(Immutable.fromJS(this.state), Immutable.fromJS(nextState));
    }
}

export default BaseComponent;
