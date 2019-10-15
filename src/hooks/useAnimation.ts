import { useEffect, useState } from "react";
import { Animated } from "react-native";

export type UseAnimationOptions = {
    doAnimation: boolean;
    duration?: number;
    delay?: number,
    callback?: () => void
}

export const useAnimation = (opts: UseAnimationOptions) => {
    const [animation] = useState(new Animated.Value(0));

    const { doAnimation, duration, delay, callback } = opts;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: doAnimation ? 1 : 0,
            duration,
            delay,
            useNativeDriver: true
        }).start(callback);
    }, [doAnimation]);

    return animation;
}