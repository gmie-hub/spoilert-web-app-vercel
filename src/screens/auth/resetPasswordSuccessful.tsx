import SuccessIcon from "@spt/assets/icons/facebook.svg";
import SuccessState from "@spt/components/successState";

const ResetPasswordSuccessfully = () => {
  return (
    <SuccessState
      icon={SuccessIcon.src}
      title="Password Reset Successful 🎉"
      description="You have successfully reset your password. You can now log in with your new password"
      buttonLabel="Log In"
      href="/auth/signin"
    />
  );
};

export default ResetPasswordSuccessfully;
