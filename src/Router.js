/**
 * Created by InspireUI on 19/02/2017.
 *
 * @format
 */

import React from "react";
import PropTypes from "prop-types";
import { View, StatusBar, I18nManager } from "react-native";
import { WooWorker } from "api-ecommerce";
import { ThemeProvider } from "react-native-paper";
import { StackActions, NavigationActions } from "react-navigation";
import NetInfo from "@react-native-community/netinfo";
import { connect } from "react-redux";

import { Config, Device, Styles, Theme, withTheme } from "@common";
import { MyToast, SplashScreen } from "@containers";
import { AppIntro, ModalReview } from "@components";
import Navigation from "@navigation";

import store from "@store/configureStore";
import MenuSide from "@components/LeftMenu/MenuOverlay";
// import MenuSide from "@components/LeftMenu/MenuScale";
// import MenuSide from '@components/LeftMenu/MenuSmall';
// import MenuSide from '@components/LeftMenu/MenuWide';

import { toast, warn, closeDrawer } from "./Omni";

class Router extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  static propTypes = {
    introStatus: PropTypes.bool,
  };

  async UNSAFE_componentWillMount() {
    const { language, updateConnectionStatus, fetchHomeLayouts } = this.props;

    // init wooworker
    WooWorker.init({
      url: Config.WooCommerce.url,
      consumerKey: Config.WooCommerce.consumerKey,
      consumerSecret: Config.WooCommerce.consumerSecret,
      wp_api: true,
      version: "wc/v3",
      queryStringAuth: true,
      language: language.lang,
    });

    // initial json file from server or local
    await fetchHomeLayouts(Config.HomeCaching.url, Config.HomeCaching.enable);

    const netInfo = await NetInfo.fetch();

    updateConnectionStatus(netInfo.type !== "none");

    this.setState({ loading: false });
  }

  componentDidMount() {
    const language = store.getState().language;

    // Enable for mode RTL
    I18nManager.forceRTL(language.lang === "ar");
  }

  goToScreen = (routeName, params) => {
    if (!this.navigator) {
      return toast("Cannot navigate");
    }

    // fix the navigation for Custom page
    if (routeName === "CustomPage") {
      this.navigator.dispatch(
        StackActions.reset({
          actions: [
            NavigationActions.navigate({
              params,
              routeName,
            }),
          ],
          index: 0,
        })
      );
    } else {
      this.navigator.dispatch({
        type: "Navigation/NAVIGATE",
        routeName,
        params,
      });
    }

    closeDrawer();
  };

  render() {
    const { loading } = this.state;
    const { isDarkTheme, introStatus, navigation, initializing } = this.props;

    if (!introStatus) {
      return <AppIntro />;
    }

    if (loading || initializing) {
      return <SplashScreen navigation={navigation} />;
    }

    // get theme based on dark or light mode
    const theme = isDarkTheme ? Theme.dark : Theme.light;

    return (
      <ThemeProvider theme={theme}>
        <MenuSide
          goToScreen={this.goToScreen}
          routes={
            <View
              style={[
                Styles.app,
                { backgroundColor: theme.colors.background },
              ]}>
              <StatusBar
                barStyle={isDarkTheme ? "light-content" : "dark-content"}
                animated
                hidden={Device.isIphoneX ? false : !Config.showStatusBar}
              />
              <MyToast />
              <Navigation ref={(comp) => (this.navigator = comp)} />
              <ModalReview />
            </View>
          }
        />
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  introStatus: state.user.finishIntro,
  userInfo: state.user.user,
  language: state.language,
  netInfo: state.netInfo,
  isDarkTheme: state.app.isDarkTheme,
  rtl: state.language.rtl,

  initializing: state.layouts.initializing,
});

const mapDispatchToProps = (dispatch) => {
  const NetInfoRedux = require("@redux/NetInfoRedux");
  const LayoutRedux = require("@redux/LayoutRedux");

  return {
    updateConnectionStatus: (isConnected) => {
      dispatch(NetInfoRedux.actions.updateConnectionStatus(isConnected));
    },
    fetchHomeLayouts: (url, enable) => {
      dispatch(LayoutRedux.actions.fetchHomeLayouts(url, enable));
    },
  };
};

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Router));
