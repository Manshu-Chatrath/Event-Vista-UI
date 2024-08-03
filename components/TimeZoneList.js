import { useEffect, useState, useCallback } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import * as timeZone from "moment-timezone";
import { Modal, Portal, TextInput, Button } from "react-native-paper";
const TimeZoneList = ({ visible, setVisible, timezone, setTimezone }) => {
  const [search, setSearch] = useState(timezone);
  const index = 1;
  const count = 20;
  const [value, setValue] = useState(timezone);
  const [timezones, setTimezones] = useState([]);
  const closeModal = () => {
    setTimezone(value);
    setVisible(false);
  };
  const getTimeZones = () => {
    const timeZones = timeZone.tz.names();
    return timeZones.map((tz) => {
      const now = timeZone.tz(tz);
      const abbreviation = now.format("z");
      const offset = now.format("Z");
      const parts = tz.split("/");
      const cityName = parts.pop().replace("_", " ");
      const countryName = parts.join("/").replace("_", " ");
      return {
        label: `${cityName}, ${countryName} (${abbreviation}, ${offset})`,
        value: tz,
      };
    });
  };

  useEffect(() => {
    const allTimeZones = getTimeZones();
    const filteredTimezones = allTimeZones.filter(
      (t) =>
        t.label.toLowerCase().includes(search.toLowerCase()) ||
        t.value.toLowerCase().includes(search.toLowerCase())
    );
    const start = (index - 1) * count;
    const end = start + count;
    const filteredArr = filteredTimezones.slice(start, end);
    setTimezones([...filteredArr]);
  }, [search]);

  const renderItem = useCallback(
    ({ item }) => {
      const onPress = () => {
        setValue(item.value);
      };

      return (
        <TouchableOpacity
          onPress={onPress}
          style={{
            paddingTop: 10,
            marginLeft: 10,
            paddingLeft: 10,
            marginRight: 10,
            paddingBottom: 10,
            backgroundColor: value === item.value ? "#F44336" : "#2F2F2F",
          }}>
          <Text style={{ fontSize: 16, color: "white" }}>{item.label}</Text>
        </TouchableOpacity>
      );
    },
    [value]
  );
  return (
    <Portal>
      <Modal
        onDismiss={() => {
          setTimezone(value);
          setVisible(false);
          setSearch(timezone);
        }}
        visible={visible}
        contentContainerStyle={{ padding: 20, alignItems: "center" }}>
        <View
          style={{
            width: "98%",
            paddingTop: 20,
            height: "98%",
            justifyContent: "center",
            paddingBottom: 20,
            backgroundColor: "#2F2F2F",
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontWeight: 800,
              fontSize: 16,
              color: "white",
              textAlign: "center",
            }}>
            Search your time zone below!
          </Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}
            placeholder="Search timezone"
          />
          <FlatList
            data={timezones}
            keyExtractor={(item) => item.value}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <TouchableOpacity
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                }}>
                <Text style={{ fontSize: 16, color: "white" }}>
                  No such timezone!
                </Text>
              </TouchableOpacity>
            }
          />
          <View
            style={{
              width: "100%",
              alignItems: "center",
              paddingLeft: 10,
              paddingRight: 10,
            }}>
            <Button
              style={{
                width: "100%",
                borderRadius: 12,
                backgroundColor: "#F44336",
              }}
              labelStyle={{ color: "white" }}
              onPress={closeModal}>
              Ok
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default TimeZoneList;
