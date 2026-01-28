import SuccessIcon from "@spt/assets/icons/close-circle-svgrepo-com (1) 1.svg";
import SuccessState from "@spt/components/successState";

const KYCRejected = () => {
  return (
    <div className="w-full flex justify-start">
      <div className="w-[70%] space-y-4">
        {" "}
        <SuccessState
          icon={SuccessIcon}
          title="Verification Rejected"
          description="The NIN provided does not match your details and is unclear."
          buttonLabel="Retry Verification"
          href="/auth/signin"
        />
      </div>
    </div>
  );
};

export default KYCRejected;
