import SuccessIcon from "@spt/assets/icons/facebook.svg";
import SuccessState from "@spt/components/successState";

const AccountCreatedSuccessfully = () => {
  return (
    <SuccessState
      icon={SuccessIcon.src}
      title="Registration Successful 🎉"
      buttonLabel="Take Me In"
      href="/home"
    />
  );
};

export default AccountCreatedSuccessfully;
