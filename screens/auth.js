import Main from "../components/main";
const Auth = ({ navigation }) => {
  const handleClient = () =>
    navigation.navigate("ClientEmail", {
      type: "client",
    });

  const handleOrganizer = () =>
    navigation.navigate("Signup", {
      type: "organizer",
    });

  return (
    <>
      <Main
        handleClickButton1={handleClient}
        handleClickButton2={handleOrganizer}
        button1={"Ticket Seeker"}
        button2={"An Organizer"}
        icon1={"ticket"}
        icon2={"account-cowboy-hat"}
      />
    </>
  );
};

export default Auth;
