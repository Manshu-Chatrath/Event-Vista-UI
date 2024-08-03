import SimpleHeader from "../components/simpleHeader";
import Client from "../components/client";
import OrganizerForm from "../components/organizer";
const SignUp = ({ route, navigation }) => {
  const type = route.params?.type;
  const handleClick = () =>
    navigation.navigate("Login", {
      type: type,
    });

  const handleEmail = () => {
    navigation.navigate("ClientEmail", {
      type: type,
    });
  };

  return (
    <>
      <SimpleHeader handleClick={handleClick} title={"SignUp"} />
      {type === "client" ? (
        <Client type={type} handleEmail={handleEmail} />
      ) : type === "organizer" ? (
        <OrganizerForm navigation={navigation} />
      ) : null}
    </>
  );
};

export default SignUp;
