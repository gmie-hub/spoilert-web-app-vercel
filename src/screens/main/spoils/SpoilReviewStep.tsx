import useCreateModuleMutation from "@spt/hooks/apiRequests/useCreateModuleMutation";
import useCreateSpoilMutation from "@spt/hooks/apiRequests/useCreateSpoilMutation";

const SpoilReviewStep = () => {
  // call the hooks and preserve their return objects for inspection
  const spoilMutation = useCreateSpoilMutation();
  const moduleMutation = useCreateModuleMutation();


  const { createSpoilHandler } = spoilMutation;
  const { createModuleHandler } = moduleMutation;

  const handlePublishClick = async () => {
    try {
      if (typeof createModuleHandler !== "function") {
        // call spoil creation without module handler to avoid runtime error
        await createSpoilHandler({}, {}, undefined as any);
        return;
      }

      await createSpoilHandler({}, {}, createModuleHandler as any);
    } catch {
      // Handle error appropriately here if needed
    }
  };

  return <button onClick={handlePublishClick}>Publish</button>;
};

export default SpoilReviewStep;