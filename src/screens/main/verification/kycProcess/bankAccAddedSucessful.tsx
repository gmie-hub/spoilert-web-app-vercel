

import { useRouter } from "next/navigation";

import SuccessIcon from "@spt/assets/icons/doneblue.svg";
import SuccessState from "@spt/components/successState";

const BankAccAddedSucessful = () => {
  const router = useRouter();
  return (
    <div className="w-full flex justify-start">
      <div className="w-[70%] space-y-4">
        <SuccessState
          icon={SuccessIcon}
          title="Bank Account Added Successfully 🎉 "
          buttonLabel="Okay"
          onButtonClick={() => router.push("/create-spoils")}
        />
      </div>
    </div>
  );
};

export default BankAccAddedSucessful;
