import { commonTags } from "../reducers/constants";
import { View, Text, TouchableOpacity } from "react-native";
const TagList = ({ selectedTags, setSelectedTags }) => {
  const tags = () => {
    return commonTags.map((tag, index) => {
      let selected = selectedTags?.includes(tag) ? true : false;
      return (
        <View key={index}>
          <TouchableOpacity
            style={{
              backgroundColor: selected ? "#F44336" : "#2F2F2F",
              borderWidth: selected ? 0 : 1,
              borderColor: "white",
              borderRadius: 20,
              paddingHorizontal: 8,
              paddingBottom: 2,
              marginLeft: 4,
              marginBottom: 2,
              marginTop: 2,
              alignSelf: "flex-start",
            }}
            onPress={() => {
              if (selected) {
                const filteredTags = selectedTags.filter(
                  (tags) => tag !== tags
                );
                setSelectedTags(filteredTags);
              } else {
                selectedTags.length < 3
                  ? setSelectedTags([...selectedTags, tag])
                  : null;
              }
            }}>
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: selected ? 800 : 500,
              }}>
              {tag}
            </Text>
          </TouchableOpacity>
        </View>
      );
    });
  };
  return tags();
};
export default TagList;
