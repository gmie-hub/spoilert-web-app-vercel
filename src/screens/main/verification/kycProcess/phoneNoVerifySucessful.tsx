import SuccessIcon from "@spt/assets/icons/doneblue.svg";
import SuccessState from "@spt/components/successState";

interface PhoneNoVerifySucessfulProps {
  onContinue: () => void;
}

const PhoneNoVerifySucessful = ({ onContinue }: PhoneNoVerifySucessfulProps) => {
  return (
    <div className="w-full flex justify-start">
      <div className="w-[70%] space-y-4">
        <SuccessState
          icon={SuccessIcon}
          title="Phone Number Verified Successfully 🎉 "
          buttonLabel="Continue Verification"
          onButtonClick={onContinue}
        />
      </div>
    </div>
  );
};

export default PhoneNoVerifySucessful;
