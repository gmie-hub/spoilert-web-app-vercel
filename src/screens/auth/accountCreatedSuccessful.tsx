import SuccessIcon from "@spt/assets/icons/done-task-1lwcuCqx7L.svg";
import SuccessState from "@spt/components/successState";

const AccountCreatedSuccessfully = () => {
  return (
    <SuccessState
      icon={SuccessIcon.src}
      title="Registration Successful 🎉"
      buttonLabel="Take Me In"
      href="/auth/signin"
    />
  );
};

export default AccountCreatedSuccessfully;
