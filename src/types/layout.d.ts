type NavLinkProps = {
  icon: any;
  name: string;
  href: string;
};

export interface MainHeaderProps {
  navLinks: NavLinkProps[];
  activePath: string;
}