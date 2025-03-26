import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const VerifyOTP = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const url = import.meta.env.VITE_API_URL;

  const mutation = useMutation({
    mutationFn: (data) => axios.post(`${url}/admin/verifyOTP`, {
      email_id: data.email,
      otp: data.otp,
    }),
    onSuccess: (data) => {
      toast.success(data?.data?.message);
      navigate(`/reset-password/${email}`);
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred");
    },
  });

  const handleCodeChange = (value, index) => {
    if (value.length > 1) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const otp = verificationCode.join("");

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error("Please enter the full OTP");
      return;
    }
    mutation.mutate({ email, otp });
  };

  return (
    <div className="flex justify-center items-center w-full h-full bg-lightBlue">
      <div className="bg-white rounded-xl flex flex-col gap-10 md:p-10 p-5 max-w-[500px] w-full m-5">
        <div>
          <h1 className="font-bold text-2xl">Verify Your Identity</h1>
          <p>Enter the OTP sent to your email to proceed with resetting your password</p>
        </div>
        <form className="flex flex-col gap-10" onSubmit={handleVerify}>
          <div className="flex flex-col gap-5">
            <div className="flex justify-center gap-4">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  maxLength="1"
                  className="w-12 h-12 text-center text-lg border rounded-full border-black focus:outline-none"
                />
              ))}
            </div>
            <div className="flex justify-center items-center">
              <h1>
                If you didn't receive a code,{" "}
                <span
                  className="text-[#0C6DD4] cursor-pointer"
                  onClick={() => setVerificationCode(["", "", "", ""])}
                >
                  Resend
                </span>
              </h1>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue text-white border border-blue hover:text-blue p-3 hover:bg-transparent smoothly-transaction font-semibold tracking-wider"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
