import LoginForm from "../components/loginForm";
import SimpleHeader from "../components/simpleHeader";
const Login = ({ route, navigation }) => {
  const type = route.params?.type;

  return (
    <>
      <SimpleHeader title={"Login"} isButton={false} />
      <LoginForm type={type} navigation={navigation} />
    </>
  );
};
export default Login;
