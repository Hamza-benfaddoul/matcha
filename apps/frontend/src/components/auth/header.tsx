interface HeaderProps {
  label: string;
}

import { Heart } from "lucide-react";
const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <h1 className="text-3xl inline font-semibold ">
        <span className=" flex items-center gap-2 bg-gradient-to-r from-[#f9cfcf]  to-[#f87171] text-transparent bg-clip-text">
          Matcha
          <Heart className="h-6 w-6 text-rose-300" />
        </span>{" "}
      </h1>
      <p className="text-sm text-muted-foreground"> {label}</p>
    </div>
  );
};

export default Header;
