import { useLocation } from "react-router-dom";
import { axiosPrivate } from "@/api/axios";

import CardWrapper from "./card-wrapper";
import { useCallback, useEffect, useState } from "react";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import { Spinner } from "@/components/ui/spinner";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const location = useLocation();
  const param = new URLSearchParams(location.search);
  const token = param.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token");
      return;
    }
    const sendVerificationToken = async () => {
      try {
        const res = await axiosPrivate.post("/new-verification", { token });
        setSuccess(res.data.message);
      } catch (err) {
        setError(err?.response?.data?.error);
      }
    };
    /*
        newVerification(token)
          .then((data) => {
            setSuccess(data.success)
            setError(data.error)
          }).catch(() => {
            setError("Something went wrong!")
          })
        */
    sendVerificationToken();
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
        {!success && !error && <Spinner />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
export default NewVerificationForm;
