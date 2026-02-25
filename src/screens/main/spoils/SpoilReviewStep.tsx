import useCreateModuleMutation from "@spt/hooks/apiRequests/useCreateModuleMutation";
import useCreateSpoilMutation from "@spt/hooks/apiRequests/useCreateSpoilMutation";

const SpoilReviewStep = () => {
  // call the hooks and preserve their return objects for inspection
  const spoilMutation = useCreateSpoilMutation();
  const moduleMutation = useCreateModuleMutation();

  console.log("useCreateModuleMutation ->", moduleMutation);

  const { createSpoilHandler } = spoilMutation;
  const { createModuleHandler } = moduleMutation;

  const handlePublishClick = async () => {
    try {
      if (typeof createModuleHandler !== "function") {
        console.error("createModuleHandler is not a function", createModuleHandler);
        // call spoil creation without module handler to avoid runtime error
        await createSpoilHandler({}, {}, undefined as any);
        return;
      }

      await createSpoilHandler({}, {}, createModuleHandler as any);
    } catch (error) {
      console.error("Error creating spoil:", error);
    }
  };

  return <button onClick={handlePublishClick}>Publish</button>;
};

export default SpoilReviewStep;