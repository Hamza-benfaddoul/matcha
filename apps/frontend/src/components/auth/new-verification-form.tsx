// import { BeatLoader } from 'react-spinners'
import axios from "@/api/axios.js";
import { useSearchParams } from "react-router-dom";

import CardWrapper from "./card-wrapper";
import { useCallback, useEffect, useState } from "react";
//import { newVerification } from '@/actions/new-verification';
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError("Missing token");
      return;
    }

    try {
      setError("");
      setSuccess("");
      const response = await axios.post("/new-verification-token", { token });
      console.log("login respornse", response);

      // Redirect to protected route after successful login
      //navigate('/protected');  // Replace '/prote
      setSuccess(response.data.success);
      setError(response.data.error);
    } catch (error) {
      setError("Something went wrong!");
    }
    /*
        newVerification(token)
          .then((data) => {
            setSuccess(data.success)
            setError(data.error)
          }).catch(() => {
            setError("Something went wrong!")
          })
        */
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && (
          // <BeatLoader />
          <></>
        )}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
export default NewVerificationForm;
