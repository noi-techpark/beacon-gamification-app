import { useEffect, useState } from "react";
import { Animated } from "react-native";

export type UseAnimationOptions = {
    doAnimation: boolean;
    duration?: number;
    delay?: number;
    disableNative?: boolean;
    callback?: () => void;
}

export const useAnimation = (opts: UseAnimationOptions) => {
    const [animation] = useState(new Animated.Value(0));

    const { doAnimation, duration, delay, callback, disableNative } = opts;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: doAnimation ? 1 : 0,
            duration,
            delay,
            useNativeDriver: !disableNative
        }).start(callback);
    }, [doAnimation]);

    return animation;
}