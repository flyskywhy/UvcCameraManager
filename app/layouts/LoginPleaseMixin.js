import React, {PureComponent} from 'react';

const LoginPleaseMixin = (ComposedComponent, BindMobile, LoginPlease) => {
  return class extends PureComponent {
    render() {
      const {user} = this.props;
      if (user.secret) {
        if (user.publicInfo.phone) {
          return <ComposedComponent {...this.props} />;
        } else {
          return <BindMobile {...this.props} />;
        }
      } else {
        return <LoginPlease {...this.props} />;
      }
    }
  };
};

export default LoginPleaseMixin;
