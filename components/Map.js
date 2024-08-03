import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
const Map = ({ region }) => {
  if (region) {
    return (
      <View
        style={{
          borderRadius: 18,
          height: 200,
          overflow: "hidden",
          width: "100%",
          marginTop: 8,
        }}>
        <MapView
          style={{
            width: "100%",
            height: 200,
          }}
          region={region}>
          <Marker coordinate={region} />
        </MapView>
      </View>
    );
  }
  return null;
};

export default Map;
