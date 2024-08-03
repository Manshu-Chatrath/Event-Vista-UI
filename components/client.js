import Main from "./main";
const Client = ({ handleEmail, type }) => {
  return (
    <>
      <Main
        button1={"Sign up with Email"}
        type={type}
        handleClickButton1={handleEmail}
        icon1={"email"}
        icon2={"google"}
      />
    </>
  );
};

export default Client;
