/** @format */

import React, { Component } from "react";
import { View } from "react-native";

import { Color, Styles, withTheme } from "@common";
import { PostDetail } from "@containers";
import { Logo, Back } from "./IconNav";

@withTheme
export default class NewsDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const dark = navigation.getParam("dark", false);
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );

    return {
      headerTitle: Logo(),
      tabBarVisible: false,
      headerLeft: Back(navigation, null, dark),

      headerTintColor: Color.headerTintColor,
      headerStyle,
      headerTitleStyle: Styles.Common.headerStyle,
    };
  };

  UNSAFE_componentWillMount() {
    const {
      theme: {
        colors: { background },
        dark,
      },
    } = this.props;

    this.props.navigation.setParams({
      headerStyle: Styles.Common.toolbar(background, dark),
      dark,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.theme.dark !== nextProps.theme.dark) {
      const {
        theme: {
          colors: { background },
          dark,
        },
      } = nextProps;
      this.props.navigation.setParams({
        headerStyle: Styles.Common.toolbar(background, dark),
        dark,
      });
    }
  }

  render() {
    const { state } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        {typeof state.params !== "undefined" && (
          <PostDetail post={state.params.post} />
        )}
      </View>
    );
  }
}
