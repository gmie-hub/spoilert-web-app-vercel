import SuccessIcon from "@spt/assets/icons/doneblue.svg";
import SuccessState from "@spt/components/successState";

const PhoneNoVerifySucessful = () => {
  return (
    <div className="w-full flex justify-start">
      <div className="w-[70%] space-y-4">
        {" "}
        <SuccessState
          icon={SuccessIcon}
          title="Phone Number Verified Successfully 🎉 "
          buttonLabel="Continue Verification"
          href="/auth/signin"
        />
      </div>
    </div>
  );
};

export default PhoneNoVerifySucessful;
