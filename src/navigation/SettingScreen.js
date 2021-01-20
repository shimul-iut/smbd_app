/** @format */

import React, { Component } from "react";

import { Languages, Color, Styles, withTheme } from "@common";
import { Setting } from "@containers";
import { Menu, Title } from "./IconNav";

@withTheme
export default class SettingScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );
    const dark = navigation.getParam("dark", false);
    const text = navigation.getParam("text", Color.headerTintColor);

    return {
      headerTitle: Title(Languages.Settings, text),
      headerLeft: Menu(dark),

      headerTintColor: Color.headerTintColor,
      headerStyle,
    };
  };

  UNSAFE_componentWillMount() {
    const {
      theme: {
        colors: { background, text },
        dark,
      },
    } = this.props;

    this.props.navigation.setParams({
      headerStyle: Styles.Common.toolbar(background, dark),
      dark,
      text,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.theme.dark !== nextProps.theme.dark) {
      const {
        theme: {
          colors: { background, text },
          dark,
        },
      } = nextProps;
      this.props.navigation.setParams({
        headerStyle: Styles.Common.toolbar(background, dark),
        dark,
        text,
      });
    }
  }

  render() {
    return <Setting />;
  }
}
