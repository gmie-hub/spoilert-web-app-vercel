import QuestionIcon from "@spt/assets/icons/question-chat-svgrepo-com 1.svg";
import { Card } from "@spt/components";
import SuccessState from "@spt/components/successState";

const ConfirmBankAccount = ({
  isSaving,
  onBack,
  onConfirm,
}: {
  isSaving: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) => (
  <main className="w-full bg-white">
    <Card className="mx-auto my-10 w-full max-w-[648px] rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 sm:my-14">
      <SuccessState
        showBack
        onBackClick={onBack}
        icon={QuestionIcon}
        iconWidth={100}
        iconHeight={100}
        title="Are you sure you want to save this account?"
        description="You can only link one bank account to your Institution account on Spoilert. To change it later, please contact the admin."
        buttonLabel={isSaving ? "Saving..." : "Save Bank Details"}
        onButtonClick={onConfirm}
      />
    </Card>
  </main>
);

export default ConfirmBankAccount;
