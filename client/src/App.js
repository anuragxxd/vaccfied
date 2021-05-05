import React, { Component } from "react";
import {
  EuiText,
  EuiLoadingContent,
  EuiSpacer,
  EuiCard,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonIcon,
  EuiHorizontalRule,
  EuiButtonGroup,
  EuiPanel,
  EuiBottomBar,
  EuiConfirmModal,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiSwitch,
  EuiFieldNumber,
  EuiLoadingSpinner,
  EuiButton,
} from "@elastic/eui";
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
              slots are avaliable at your location.
            </h6>
          </EuiText>
        </EuiPanel>
        <EuiHorizontalRule margin="xxl" size="half" />
        <EuiPanel style={{ margin: "15px" }}>
          <EuiForm>
            <EuiFormRow label="Name">
              <EuiFieldText
                prepend={<EuiIcon type="user" />}
                placeholder="Enter your Name"
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </EuiFormRow>
            <EuiFormRow label="Email">
              <EuiFieldText
                prepend={<EuiIcon type="email" />}
                placeholder="Enter your Email"
                value={this.state.email}
                type="email"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </EuiFormRow>
            <EuiFormRow label="Age">
              <EuiFieldNumber
                prepend={<EuiIcon type="calendar" />}
                placeholder="Enter your Age"
                value={this.state.age}
                type="number"
                onChange={(e) => this.setState({ age: e.target.value })}
              />
            </EuiFormRow>
            <EuiHorizontalRule size="quarter" margin="m"></EuiHorizontalRule>
            <EuiFormRow label="Pincode">
              <EuiFieldText
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
                  console.log("submit");
                }}
              >
                <b>Submit</b>
              </EuiText>
            </EuiBottomBar>
          </EuiForm>
        </EuiPanel>
      </>
    );
  }
}
