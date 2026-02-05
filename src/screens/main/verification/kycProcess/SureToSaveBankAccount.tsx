import SuccessIcon from "@spt/assets/icons/question-chat-svgrepo-com 1.svg";
import SuccessState from "@spt/components/successState";

const SureToSaveBankAccount = () => {
  return (
    <div className="w-full flex justify-start">
      <div className="w-[70%] space-y-4">
        {" "}
        <SuccessState
          showBack
          icon={SuccessIcon}
          iconWidth={100}
          iconHeight={100}
          title="Are you sure you want to save this account?"
          description="You can only link one bank account to your Spoilert profile. To change it later, please contact the admin."
          buttonLabel="Save Bank Details"
          href="/auth/signin"
        />
      </div>
    </div>
  );
};

export default SureToSaveBankAccount;
