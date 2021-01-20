/**
 * Created by InspireUI on 19/02/2017.
 *
 * @format
 */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { connect } from "react-redux";
import { Constants, withTheme } from "@common";
import { HorizonList, ModalLayout, PostList } from "@components";
import { isEmpty } from "lodash";
import styles from "./styles";

class Home extends PureComponent {
  static propTypes = {
    fetchAllCountries: PropTypes.func.isRequired,
    layoutHome: PropTypes.any,
    onViewProductScreen: PropTypes.func,
    onShowAll: PropTypes.func,
    showCategoriesScreen: PropTypes.func,
  };

  componentDidMount() {
    const {
      fetchAllCountries,
      isConnected,
      fetchCategories,
      countries,
    } = this.props;
    if (isConnected) {
      const { list } = countries;
      if (!list || isEmpty(list)) {
        fetchCategories();
        fetchAllCountries();
      }
    }
  }

  render() {
    const {
      layoutHome,
      onViewProductScreen,
      showCategoriesScreen,
      onShowAll,
      theme: {
        colors: { background },
      },
      language,
    } = this.props;

    const isHorizontal =
      layoutHome === Constants.Layout.horizon || layoutHome === 7;

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        {isHorizontal && (
          <HorizonList
            language={language}
            onShowAll={onShowAll}
            onViewProductScreen={onViewProductScreen}
            showCategoriesScreen={showCategoriesScreen}
          />
        )}

        {!isHorizontal && (
          <PostList
            parentLayout={layoutHome}
            onViewProductScreen={onViewProductScreen}
          />
        )}
        <ModalLayout />
      </View>
    );
  }
}

const mapStateToProps = ({ products, countries, netInfo, language }) => ({
  layoutHome: products.layoutHome,
  countries,
  isConnected: netInfo.isConnected,
  language,
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const CountryRedux = require("@redux/CountryRedux");
  const { actions } = require("@redux/CategoryRedux");

  return {
    ...ownProps,
    ...stateProps,
    fetchCategories: () => actions.fetchCategories(dispatch),
    fetchAllCountries: () => CountryRedux.actions.fetchAllCountries(dispatch),
  };
}

export default withTheme(
  connect(
    mapStateToProps,
    undefined,
    mergeProps
  )(Home)
);
