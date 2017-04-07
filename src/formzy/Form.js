import React from "react";
import assoc from "lodash/fp/assoc";
import get from "lodash/fp/get";
import unset from "lodash/fp/unset";
import merge from "lodash/fp/merge";
import flatMap from "lodash/fp/flatMap";
import values from "lodash/fp/values";

const len = d => flatMap(e => typeof e === 'object' ? len(e) : e, values(d));

export class Form extends React.Component {
  constructor() {
    super();
    this.state = { formValues: {}, formErrors: {} };
  }
  onChange = (name, e) => {
    this.setState(
      assoc(["formValues", ...name], e.target.value, this.state),
      this.props.validateOnChange ? this.validate : f => f
    );
  };
  getValue = name => get(name, this.state.formValues);
  getErrors = name => get(name, this.state.formErrors) || [];
  registerField = n => {
    const name = Array.isArray(n) ? n : [n];
    const onChange = this.onChange.bind(null, name);
    const unregister = () => this.setState(unset(name));
    this.setState(assoc(["formValues", ...name], ""));
    const value = "";
    return {
      onChange,
      getValue: this.getValue,
      getErrors: this.getErrors,
      name,
      unregister
    };
  };
  getChildContext() {
    return {
      registerField: name => this.registerField(name),
      formValues: this.state.formValues
    };
  }
  validate = () => {
    const formErrors = this.props.validate(this.state.formValues);
    this.setState({ formErrors });
    if (len(formErrors).length) {
      return false;
    }

    return true;
  }
  onSubmit = e => {
    const isValid = this.validate();
    if (isValid) return this.props.onSubmit(e, this.state.formValues);

    e.preventDefault();
  };
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <pre>{JSON.stringify(this.state, null, 4)}</pre>{this.props.children}
      </form>
    );
  }
}

Form.childContextTypes = {
  registerField: React.PropTypes.func,
  formValues: React.PropTypes.object
};

export class Section extends React.Component {
  getChildContext() {
    return {
      registerField: name => this.context.registerField([this.props.name, name])
    };
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}

Section.childContextTypes = {
  registerField: React.PropTypes.func
};

Section.contextTypes = {
  registerField: React.PropTypes.func
};

export class Field extends React.Component {
  componentWillMount() {
    this.setState(this.context.registerField(this.props.name));
  }
  componentWillUnmount() {
    this.state.unregister();
  }
  render() {
    const { onChange, name, getValue, getErrors } = this.state;
    const { formValues } = this.context;

    return this.props.children({
      value: getValue(name),
      errors: getErrors(name),
      onChange
    });
  }
}

Field.contextTypes = {
  registerField: React.PropTypes.func,
  formValues: React.PropTypes.object
};
