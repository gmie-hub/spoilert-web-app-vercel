import SuccessIcon from "@spt/assets/icons/done-task-1lwcuCqx7L.svg";
import SuccessState from "@spt/components/successState";

const InstitutionResetPasswordSuccessful = () => {
  return (
    <SuccessState
      icon={SuccessIcon}
      title="Password Reset Successful 🎉"
      description="You have successfully reset your password. You can now log in with your new institution account"
      buttonLabel="Log In"
      href="/institution/login"
    />
  );
};

export default InstitutionResetPasswordSuccessful;
