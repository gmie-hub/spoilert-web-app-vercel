import ImageIcon from "@spt/assets/icons/Empty Image.svg";
import SuccessState from "@spt/components/successState";

const StartVerification = () => {
  return (
    <div className="w-full flex justify-start">
      <div className="w-[70%] space-y-4">
        {" "}
        <SuccessState
          icon={ImageIcon}
          title="Verify Your Identity"
          description={
            <>
              <span style={{ color: "var(--color-gray-dark)" }}>
                To start creating Spoylz, we need to verify your identity. This
                includes confirming{" "}
              </span>
              <strong style={{ color: "var(--color-black)" }}>
                your phone number, verifying your NIN (for Nigerians)
              </strong>
              <span style={{ color: "var(--color-gray-dark)" }}> or a </span>
              <strong style={{ color: "var(--color-black)" }}>
                government-issued ID (for other countries), and adding your bank
                account.
              </strong>
            </>
          }
          buttonLabel="Start Verification"
          href="/auth/signin"
        />
      </div>
    </div>
  );
};

export default StartVerification;
