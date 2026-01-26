import SuccessIcon from "@spt/assets/icons/doneblue.svg";
import SuccessState from "@spt/components/successState";

const NINProcessing = () => {
  return (
    <div className="w-full flex justify-start">
      <div className="w-[70%] space-y-4">
        {" "}
        <SuccessState
          icon={SuccessIcon}
          title="Your NIN Verification Is Being Processed 🎉  "
          description="You will be notified once it is completed."
          buttonLabel="Okay"
          href="/auth/signin"
        />
      </div>
    </div>
  );
};

export default NINProcessing;
