import React, { Component } from "react";
import {
  EuiText,
  EuiLoadingContent,
  EuiSpacer,
  EuiCard,
  EuiIcon,
  EuiHorizontalRule,
  EuiPanel,
  EuiBottomBar,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiSwitch,
  EuiFieldNumber,
  EuiLoadingSpinner,
  EuiButton,
  EuiGlobalToastList,
} from "@elastic/eui";
import axios from "axios";
if (localStorage.getItem("theme") === "dark") {
  require("@elastic/eui/dist/eui_theme_amsterdam_dark.css");
} else {
  require("@elastic/eui/dist/eui_theme_amsterdam_light.css");
}

export default class App extends Component {
  state = {
    name: "",
    email: "",
    pincode: "",
    age: "",
    loader: false,
    toasts: [],
  };

  handleLocation = async () => {
    this.setState({ loader: true });
    navigator.geolocation.getCurrentPosition((position) => {
      if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.");
      }
      console.log(position);
      // position.coords.latitude, position.coords.longitude
    });
    this.setState({ loader: false });
  };

  handleSubmit = async () => {
    let errors = [];
    if (this.state.name === "") {
      errors.push(<div>Name field is required!</div>);
    }
    if (this.state.email === "") {
      errors.push(<div>Email field is required!</div>);
    }
    if (this.state.age === "") {
      errors.push(<div>Age field is required!</div>);
    }
    if (this.state.pincode === "") {
      errors.push(<div>Pincode field is required!</div>);
    }
    if (errors.length > 0) {
      this.setState({
        toasts: [
          ...this.state.toasts,
          {
            id: 1,
            title: "Oops, there was an error",
            color: "danger",
            iconType: "help",
            text: errors.map((error) => error),
          },
        ],
      });
    } else {
      await axios.post("api/users", {
        name: this.state.name,
        age: this.state.age,
        email: this.state.email,
        pincode: this.state.pincode,
      });
    }
  };

  removeToast = (removedToast) => {
    this.setState({ toasts: [] });
  };

  render() {
    return (
      <>
        <EuiPanel style={{ margin: "15px", marginTop: "30px" }}>
          <EuiText size="m" style={{ margin: "15px" }}>
            <h1 style={{ textAlign: "center", color: "#7DDED8" }}>Vaccfied</h1>
          </EuiText>
          <EuiText textAlign="center" size="m" style={{ margin: "15px" }}>
            <h6>
              Need help finding the slots for vaccination in{" "}
              <span style={{ color: "#7DDED8" }}>India</span>? Get Notified as soon the vaccine
              slots are avaliable at your location in next 7 days.
            </h6>
          </EuiText>
        </EuiPanel>
        <EuiHorizontalRule margin="xxl" size="half" />
        <EuiPanel style={{ margin: "15px" }}>
          <EuiForm>
            <EuiFormRow label="Name" fullWidth>
              <EuiFieldText
                fullWidth
                prepend={<EuiIcon type="user" />}
                placeholder="Enter your Name"
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </EuiFormRow>
            <EuiFormRow label="Email" fullWidth>
              <EuiFieldText
                fullWidth
                prepend={<EuiIcon type="email" />}
                placeholder="Enter your Email"
                value={this.state.email}
                type="email"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </EuiFormRow>
            <EuiFormRow label="Age" fullWidth>
              <EuiFieldNumber
                fullWidth
                prepend={<EuiIcon type="calendar" />}
                placeholder="Enter your Age"
                value={this.state.age}
                type="number"
                onChange={(e) => this.setState({ age: e.target.value })}
              />
            </EuiFormRow>
            <EuiHorizontalRule size="quarter" margin="m"></EuiHorizontalRule>
            <EuiFormRow label="Pincode" fullWidth>
              <EuiFieldText
                fullWidth
                prepend={<EuiIcon type="mapMarker" />}
                placeholder="Enter your Pincode"
                value={this.state.pincode}
                onChange={(e) => this.setState({ pincode: e.target.value })}
              />
            </EuiFormRow>
            {/* <EuiFormRow>
              <EuiText textAlign="center" size="s">
                <h6>or</h6>
              </EuiText>
            </EuiFormRow> */}
            {/* <EuiFormRow>
              <EuiButton fullWidth size="s" onClick={() => this.handleLocation()}>
                {this.state.loader ? (
                  <>
                    <EuiLoadingSpinner size="m" /> Please Wait
                  </>
                ) : (
                  " Use current location"
                )}
              </EuiButton>
            </EuiFormRow> */}
            <EuiBottomBar
              style={{
                color: "black",
                height: "50px",
                margin: "15px",
                borderRadius: "10px",
                backgroundColor: "#7DDED8",
              }}
              position="fixed"
            >
              <EuiText
                textAlign="center"
                onClick={() => {
                  this.handleSubmit();
                }}
              >
                <b>Submit</b>
              </EuiText>
            </EuiBottomBar>
          </EuiForm>
        </EuiPanel>
        <EuiGlobalToastList
          toasts={this.state.toasts}
          dismissToast={this.removeToast}
          toastLifeTimeMs={6000}
        />
      </>
    );
  }
}
