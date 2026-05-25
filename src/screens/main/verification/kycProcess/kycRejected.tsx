import SuccessIcon from "@spt/assets/icons/close-circle-svgrepo-com (1) 1.svg";
import SuccessState from "@spt/components/successState";
import { UserVerificationDetailsResponse } from "@spt/hooks/apiRequests/useGetUserVerificationDetailsQuery";

type KYCRejectedProps = {
  onRetry?: () => void;
  userVerificationDetails?: UserVerificationDetailsResponse;
};


 const KYCRejected = ({ onRetry, userVerificationDetails }: KYCRejectedProps) => {
  const rejectionComment =userVerificationDetails?.data[0]?.comment
    // rejectedItem?.comment ||""

  return (
    <div className="w-full flex justify-center lg:justify-start">
      <div className="w-full sm:w-[80%] lg:w-[70%] space-y-4">
        <SuccessState
          icon={SuccessIcon}  
          title="Verification Rejected"
          description={rejectionComment}
          buttonLabel="Retry Verification"
          onButtonClick={onRetry}
        />
      </div>
    </div>
  );
};

export default KYCRejected;
