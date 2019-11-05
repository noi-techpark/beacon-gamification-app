
declare module 'react-native-parallax-header' {
    import React from 'react';
    import { NativeMethodsMixinStatic, ScrollViewProperties } from "react-native";

    export interface ReactNativeParallaxHeaderProps extends ScrollViewProperties {
        
    }

    export interface ReactNativeParallaxHeaderStatic extends NativeMethodsMixinStatic, React.ComponentClass<ReactNativeParallaxHeaderProps> {

    }

    type ReactNativeParallaxHeader = ReactNativeParallaxHeaderStatic;
    var ReactNativeParallaxHeader: ReactNativeParallaxHeaderStatic;

    export default ReactNativeParallaxHeader;
}