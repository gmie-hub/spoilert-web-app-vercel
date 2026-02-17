import { FC } from "react";

import Button from "@spt/components/button";

const CertificateSection: FC = () => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex flex-col md:items-start justify-between gap-4">
        <div className="max-w-md">
          <p className="leading-relaxed">
            Give your learners a beautifully designed certificate when they
            complete this spoil.
          </p>
        </div>

        <Button className="bg-[#003344] hover:bg-[#002233] text-white rounded-lg px-6">
          Customize Certificate
        </Button>
      </div>
    </div>
  );
};

export default CertificateSection;
