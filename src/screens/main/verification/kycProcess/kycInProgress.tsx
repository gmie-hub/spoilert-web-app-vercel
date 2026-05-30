import SuccessIcon from "@spt/assets/icons/inProgress.svg";
import SuccessState from "@spt/components/successState";

const KYCInProgress = () => {
  return (
    <div className="w-full flex lg:justify-start sm:justify-center">
      <div className="w-[70%] space-y-4">
        {" "}
        <SuccessState
          icon={SuccessIcon}
          title="Your Verification Is Still In Progress "
          description="Once your verification is complete, you will be notified, and you will be able to create Spoylz."
          buttonLabel="Okay"
          href="/"
        />
      </div>
    </div>
  );
};

export default KYCInProgress;
