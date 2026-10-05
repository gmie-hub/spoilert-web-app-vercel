import Input from "@spt/components/input";

// The country code comes from the institution's country (set at sign-up), so
// it's shown as a fixed prefix and only the number itself is editable.
const PhoneNumberField = ({
  countryCode,
  disabled = false,
}: {
  countryCode: string;
  disabled?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-medium text-gray-700">Phone Number</span>
    <div className="flex items-start gap-2">
      <span className="flex h-12 shrink-0 items-center rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm font-medium text-gray-600">
        +{countryCode}
      </span>
      {/* Input always renders a label; hide its empty one so the boxes line up. */}
      <div className="min-w-0 flex-1 [&>div>label]:hidden">
        <Input
          name="phoneNumber"
          label=""
          placeholder="e.g 09012345678"
          numericOnly
          disabled={disabled}
        />
      </div>
    </div>
  </div>
);

export default PhoneNumberField;
