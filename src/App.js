import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Form, Section, Field } from "./formzy/Form";
import mapValues from "lodash/fp/mapValues";

const Fields = () => (
  <div>
    <Field name="line1">
      {({ value, onChange, errors }) => (
        <div>
          {errors.map(e => <span>{e}</span>)}
          <input
            name="line1"
            placeholder="Line 1"
            onChange={onChange}
            value={value}
          />
        </div>
      )}
    </Field>
    <Field name="line2">
      {({ value, onChange, errors }) => (
        <div>
          {" "}{errors.map(e => <span>{e}</span>)}
          <input
            name="line2"
            placeholder="Line 2"
            onChange={onChange}
            value={value}
          />
        </div>
      )}
    </Field>
    <Field name="line3">
      {({ value, onChange, errors }) => (
        <div>
          {" "}{errors.map(e => <span>{e}</span>)}
          <input
            name="line2"
            placeholder="Line 3"
            onChange={onChange}
            value={value}
          />
        </div>
      )}
    </Field>
    <Field name="city">
      {({ value, onChange, errors }) => (
        <div>
          {" "}{errors.map(e => <span>{e}</span>)}
          <select onChange={onChange} value={value} name="city">
            <option selected>Select a city...</option>
            <option value="london">London</option>
            <option value="manchester">Manchester</option>
          </select>
        </div>
      )}
    </Field>
  </div>
);

class App extends React.Component {
  constructor() {
    super();
    this.state = { same: true };
  }
  handleToggle = () => this.setState(state => ({ same: !state.same }));

  validate = values => {
    console.log(values);
    let errors = {
      billing: {}
    };
    errors.billing = {
      line1: [values.billing.line1 == "" ? "required" : false].filter(Boolean),
      line2: [values.billing.line2 == "" ? "required" : false].filter(Boolean),
      line3: [values.billing.line3 == "" ? "required" : false].filter(Boolean),
      city: [values.billing.city == "" ? "required" : false].filter(Boolean)
    };

    if (values.delivery) {
      errors.delivery = {
        line1: [values.delivery.line1 == "" ? "required" : false].filter(
          Boolean
        ),
        line2: [values.delivery.line2 == "" ? "required" : false].filter(
          Boolean
        ),
        line3: [values.delivery.line3 == "" ? "required" : false].filter(
          Boolean
        ),
        city: [values.delivery.city == "" ? "required" : false].filter(Boolean)
      };
    }

    return errors;
  };

  onSubmit = (e, values) => {
    e.preventDefault();
    console.log("submittttt");
  };

  render() {
    return (
      <Form action="/foo" validate={this.validate} onSubmit={this.onSubmit}>
        <div style={{ display: "flex" }}>
          <Section name="billing">
            <h1>Billing Options</h1>
            <Fields />
            <input
              type="checkbox"
              onChange={this.handleToggle}
              checked={this.state.same}
            />
            {" "}
            Billing and delivery the same?
          </Section>
          {!this.state.same &&
            <Section name="delivery">
              <h1>Delivery Options</h1>
              <Fields />
            </Section>}
        </div>
        <Field name="foo">
          {({ value, onChange }) => (
            <input name="foo" value={value} onChange={onChange} />
          )}
        </Field>
        <input type="submit" />
      </Form>
    );
  }
}
export default App;
