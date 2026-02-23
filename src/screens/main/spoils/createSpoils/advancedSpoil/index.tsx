// const AdvancedSpoil = () => {
//     return (
//         <Stack
//       mr={{ xs: 2, md: 20 }}
//       ml={{ xs: 2, md: 10 }}
//       my={{ xs: 2, md: 6 }}
//       spacing={4}
//     >
//       <Stack spacing={1}>
//         <p className="text-sm font-medium text-gray-500">
//           {selectedType === "advanced" ? "Advanced Spoil" : "Simple Spoil"}
//         </p>
//         <h3 className="text-2xl font-semibold text-black">
//           Create an {selectedType === "advanced" ? "Advanced" : "Simple"} Spoil
//         </h3>
//       </Stack>

//       <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 4, lg: 6 }}>
//         <div className="w-full rounded-3xl bg-white p-6 shadow-sm lg:max-w-xs">
//           <h4 className="text-xl font-semibold text-gray-900">
//             Spoil Progress
//           </h4>
//           <p className="mt-1 text-sm text-gray-500">
//             Track your progress across the three steps.
//           </p>

//           <div className="mt-6">
//             <CustomStepper activeStep={activeStep} steps={steps} />
//           </div>
//         </div>

//         <div className="flex-1">{renderStepContent()}</div>
//       </Stack>
//     </Stack>
//     )
// }