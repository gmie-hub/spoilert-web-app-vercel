

import SuccessIcon from "@spt/assets/icons/doneblue.svg";
import SuccessState from "@spt/components/successState";

const BankAccAddedSucessful = () => {
  return (
    <div className="w-full flex justify-start">
      <div className="w-[70%] space-y-4">
        {" "}
        <SuccessState
          icon={SuccessIcon}
          title="Bank Account Added Successfully 🎉 "
          buttonLabel="Okay"
          href="/auth/signin"
        />
      </div>
    </div>
  );
};

export default BankAccAddedSucessful;
