// import Button from "@spt/components/button";
// import Flex from "@spt/components/flex";
// import Stack from "@spt/components/stack";

// const NewsLetter = () => {
//   return (
//     <section className="bg-gray-footer w-full">
//       <Flex
//         className="px-8 md:px-[132px] py-6 md:py-12 items-start md:items-center flex-col md:flex-row"
//         direction={{ base: "column", md: "row" }}
//         justifyContent="between"
//         spacing={{ base: "gap-8", md: "gap-20" }}
//         // alignItems={{ base: "start", md: "center" }}
//       >
//         <Stack className="text-white">
//           <h5 className="md:text-lg text-base">Join our newsletter</h5>
//           <p>
//             Subscribe to our newsletter and be the first to receive exclusive
//             updates, improvements and special offers.
//           </p>
//         </Stack>

//         <div>
//           <Button variant="yellow">Subscribe</Button>
//         </div>
//       </Flex>
//     </section>
//   );
// };

// export default NewsLetter;


import Button from "@spt/components/button";
import Flex from "@spt/components/flex";
import Stack from "@spt/components/stack";

const NewsLetter = () => {
  return (
    <section className="bg-gray-footer w-full">
      <Flex
        className="px-8 md:px-[132px] py-6 md:py-12 items-start md:items-center flex-col md:flex-row"
        direction={{ base: "column", md: "row" }}
        justifyContent="between"
        spacing={{ base: "gap-8", md: "gap-20" }}
      >
        <Stack className="text-white">
          <h5 className="md:text-lg text-base">Join our newsletter</h5>
          <p>
            Subscribe to our newsletter and be the first to receive exclusive
            updates, improvements and special offers.
          </p>
        </Stack>

        {/* Email input + button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="h-[44px] px-4 rounded-md outline-none w-full md:w-[260px] text-sm bg-white text-[#666869]"
          />

          <Button variant="yellow">Subscribe</Button>
        </div>
      </Flex>
    </section>
  );
};

export default NewsLetter;