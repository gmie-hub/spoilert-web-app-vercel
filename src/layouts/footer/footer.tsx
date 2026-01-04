import Box from "@spt/components/box";

import Info from "./info";
import NewsLetter from "./newsLetter";

const Footer = () => {
  return (
    <footer className="w-full">
      <Box>
        <NewsLetter />
        <Info />
      </Box>
    </footer>
  );
};

export default Footer;
