declare module "react-native-connectivity-status" {
    const ConnectivityManager: {
        isBluetoothEnabled: () => Promise<boolean>;
    }

    export default ConnectivityManager;
}