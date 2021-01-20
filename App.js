/** @format */

import React from "react";

import { Font } from "@expo";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";

import store from "@store/configureStore";
import RootRouter from "./src/Router";
import "./ReactotronConfig";

function cacheFonts(fonts) {
  return fonts.map((font) => Font.loadAsync(font));
}

export default class App extends React.Component {
  loadAssets = async () => {
    const fontAssets = cacheFonts([
      { OpenSans: require("@assets/fonts/OpenSans-Regular.ttf") },
      { Baloo: require("@assets/fonts/Baloo-Regular.ttf") },

      { Entypo: require("@expo/vector-icons/fonts/Entypo.ttf") },
      {
        "Material Icons": require("@expo/vector-icons/fonts/MaterialIcons.ttf"),
      },
      {
        MaterialCommunityIcons: require("@expo/vector-icons/fonts/MaterialCommunityIcons.ttf"),
      },
      {
        "Material Design Icons": require("@expo/vector-icons/fonts/MaterialCommunityIcons.ttf"),
      },
      { FontAwesome: require("@expo/vector-icons/fonts/FontAwesome.ttf") },
      {
        "simple-line-icons": require("@expo/vector-icons/fonts/SimpleLineIcons.ttf"),
      },
      { Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf") },
    ]);

    // const imageAssets = cacheImages([
    //   Images.icons.iconCard,
    //   Images.icons.iconColumn,
    //   Images.icons.iconLeft,
    //   Images.icons.iconRight,
    //   Images.icons.iconThree,
    //   Images.icons.iconAdvance,
    //   Images.icons.iconHorizal,
    //   Images.icons.back,
    //   Images.icons.home,
    //   Images.IconSwitch,
    //   Images.IconFilter,
    //   Images.IconList,
    //   Images.IconGrid,
    //   Images.IconCard,
    //   Images.IconSearch,
    //   Images.IconHome,
    //   Images.IconCategory,
    //   Images.IconHeart,
    //   Images.IconOrder,
    //   Images.IconCart,
    // ]);

    await Promise.all([...fontAssets]);
  };

  componentDidMount() {
    this.loadAssets();
  }

  render() {
    const persistor = persistStore(store);

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootRouter />
        </PersistGate>
      </Provider>
    );
  }
}
