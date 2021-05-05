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
  EuiSelect,
  EuiGlobalToastList,
} from "@elastic/eui";
import axios from "axios";
// if (localStorage.getItem("theme") === "dark") {
require("@elastic/eui/dist/eui_theme_amsterdam_dark.css");
// } else {
// require("@elastic/eui/dist/eui_theme_amsterdam_light.css");
// }

export default class App extends Component {
  state = {
    name: "",
    email: "",
    pincode: "",
    age: "",
    loader: false,
    toasts: [],
    isPincode: true,
    states: [],
    stateValue: "",
    districts: [{ value: "Select State..", text: "Select State.." }],
    districtValue: "Select State..",
  };

  componentDidMount = async () => {
    const res = await axios.get("https://cdn-api.co-vin.in/api/v2/admin/location/states");
    const states = res.data.states.map((state) => {
      return { value: state.state_id, text: state.state_name };
    });
    this.setState({ states, stateValue: states[0].value });
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
    if (this.state.isPincode) {
      if (this.state.pincode === "") {
        errors.push(<div>Pincode field is required!</div>);
      }
    } else {
      if (this.state.districtValue === "") {
        errors.push(<div>District field is required!</div>);
      }
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
      let res;
      if (this.state.isPincode) {
        res = await axios.post("api/users", {
          name: this.state.name,
          age: this.state.age,
          email: this.state.email,
          pincode: this.state.pincode,
        });
      } else {
        res = await axios.post("api/users/district", {
          name: this.state.name,
          age: this.state.age,
          email: this.state.email,
          district: this.state.districtValue,
        });
      }
      console.log(res.status);
      if (res.status === 201) {
        this.setState({
          name: "",
          age: "",
          email: "",
          pincode: "",
          toasts: [
            ...this.state.toasts,
            {
              id: 1,
              title: "You will be notified soon!",
              color: "success",
              iconType: "cheer",
              text:
                "Register for another user or visit https://selfregistration.cowin.gov.in/ for more information.",
            },
          ],
        });
      } else {
        this.setState({
          toasts: [
            ...this.state.toasts,
            {
              id: 1,
              title: "Oops, there was an error",
              color: "danger",
              iconType: "help",
              text: "It's us not you!",
            },
          ],
        });
      }
    }
  };

  handleChangeState = async (e) => {
    this.setState({
      stateValue: e.target.value,
      loader: true,
      districts: [{ value: "Loading...", text: "Loading..." }],
    });
    this.setState({ districtValue: "Loading..." });
    const res = await axios.get(
      `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${e.target.value}`
    );
    const districts = res.data.districts.map((district) => {
      return { value: district.district_id, text: district.district_name };
    });
    this.setState({ districts, districtValue: districts[0].district_id, loader: false });
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
            {/* <h3 style={{ float: "right", marginTop: "-48px" }}>
              <EuiIcon
                type="invert"
                size="xl"
                onClick={() => {
                  localStorage.setItem(
                    "theme",
                    localStorage.getItem("theme") === "dark" ? "light" : "dark"
                  );
                  window.location.reload();
                }}
              ></EuiIcon>
            </h3> */}
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
            <EuiFormRow fullWidth>
              <EuiSwitch
                checked={this.state.isPincode}
                onChange={() => this.setState({ isPincode: !this.state.isPincode })}
                label={this.state.isPincode ? "Pincode" : "Location"}
                fullWidth
              ></EuiSwitch>
            </EuiFormRow>
            {this.state.isPincode ? (
              <EuiFormRow label="Pincode" fullWidth>
                <EuiFieldText
                  fullWidth
                  prepend={<EuiIcon type="mapMarker" />}
                  placeholder="Enter your Pincode"
                  value={this.state.pincode}
                  onChange={(e) => this.setState({ pincode: e.target.value })}
                />
              </EuiFormRow>
            ) : (
              <>
                <EuiFormRow label="State" fullWidth>
                  <EuiSelect
                    fullWidth
                    options={this.state.states}
                    value={this.state.stateValue}
                    onChange={(e) => this.handleChangeState(e)}
                  />
                </EuiFormRow>
                <EuiFormRow label="District" fullWidth>
                  <EuiSelect
                    fullWidth
                    options={this.state.districts}
                    value={this.state.districtValue}
                    onChange={(e) => this.setState({ districtValue: e.target.value })}
                  />
                </EuiFormRow>
              </>
            )}

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
            <EuiSpacer size="xxl"></EuiSpacer>
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
