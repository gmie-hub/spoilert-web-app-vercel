import NewsLetter from "./newsLetter";
import Info from "./info";
import Box from "@spt/components/box";

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
