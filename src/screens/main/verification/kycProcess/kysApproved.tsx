import SuccessIcon from "@spt/assets/icons/doneblue.svg";
import SuccessState from "@spt/components/successState";

const KYCApproved = () => {
  return (
    <div className="w-full flex justify-center lg:justify-start">
      <div className="w-full sm:w-[80%] lg:w-[70%] space-y-4">
        {" "}
        <SuccessState
          icon={SuccessIcon}
          title="Verification Approved. 🎉 "
          description="Your verification has been successfully approved! You can now start creating Spoils."
          buttonLabel="Start Creating Spoils"
          href="/create-spoils"
          showSecondBtn
          secondBtnLabel="Back to Home"
          onSecondBtnClick={() => {}}
        />
      </div>
    </div>
  );
};

export default KYCApproved;
