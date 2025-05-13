"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Social = () => {
  const onClick = (provider: "google" | "github") => {
    window.location.href = `http://localhost:8080/api/auth/${provider}`;
  };
  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
        Login with Google
      </Button>
      {/* <Button size='lg' className='w-full' variant='outline' onClick={() => onClick('github')} > */}
      {/*   <FaGithub className='h-5 w-5' /> */}
      {/* </Button> */}
    </div>
  );
};

export default Social;
