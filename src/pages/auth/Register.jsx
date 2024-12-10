/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { RegisterUser } from "../../store/slices/userSlice";
import RegisterLogo from "../../assets/svgs/RegisterLogo";

/**
 * Register Component - Handles user registration functionality
 * @returns {JSX.Element} Register form UI
 */
function Register() {
  // Redux state selectors
  const users = useSelector((state) => state.user?.user);
  const loggedinUser = useSelector((state) => state.user?.Loggedin);

  // Hooks for navigation and dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get reCAPTCHA site key from environment variables
  const siteKey = import.meta.env.VITE_SITE_KEY;

  // Initialize react-hook-form with default values
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "", 
    },
  });

  /**
   * Handle form submission
   * @param {Object} RegisteredData - Form data containing username, email and password
   */
  const onSubmit = (RegisteredData) => {
    dispatch(RegisterUser(RegisteredData));
    navigate("/");
  };

  return (
    <div className="main-registerPage-container w-full min-h-screen relative bg-[#FAFBFC]">
      {/* Left side trello image */}
      <div className="trello-left-image w-[25vw] max-md:w-[35vw] max-sm:hidden absolute bottom-[2vw] left-[1vw]">
        <img
          className="w-full h-full"
          src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/trello-left.4f52d13c.svg"
          alt="trello-left-image"
        />
      </div>

      {/* Right side trello image */}
      <div className="trello-right-image w-[25vw] max-md:w-[35vw] max-sm:hidden absolute bottom-[2vw] right-[1vw]">
        <img
          className="w-full h-full"
          src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/trello-right.e6e102c7.svg"
          alt="trello-left-image"
        />
      </div>

      {/* Form Container */}
      <div className="formContainer w-full h-[100dvh] flex justify-center items-center">
        <div className="inner-form-container w-[25vw] max-md:w-[40vw] max-sm:w-[90vw] h-[45vw] max-md:h-[65vw] max-sm:h-[140vw] shadow-md p-2 bg-white">
          {/* Logo Section */}
          <div className="logo w-full flex justify-center">
            <RegisterLogo />
          </div>

          {/* Heading */}
          <div className="heading-span-wrapper text-[1.3vw] max-md:text-[2vw] max-sm:text-[4vw] font-bold w-full flex justify-center">
            <span>Sign up to continue</span>
          </div>

          {/* Registration Form */}
          <form className="flex flex-col gap-2 mt-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Username Input */}
            <div className="Forusername m-auto w-full px-3">
              <input
                className="text-[1vw] max-md:text-[1.5vw] max-sm:text-[3vw] border-[#8590A1] rounded-md border-[1px] w-full p-2"
                placeholder="Enter Your Username"
                type="text"
                {...register("username", {
                  required: "username is required",
                })}
              />
              <p className="text-sm max-md:text-[1.5vw] max-sm:text-[3vw] text-red-500">
                {errors.username?.message}
              </p>
            </div>

            {/* Email Input */}
            <div className="Foremail m-auto w-full px-3">
              <input
                className="text-[1vw] max-md:text-[1.5vw] max-sm:text-[3vw] border-[#8590A1] rounded-md border-[1px] w-full p-2"
                placeholder="Enter Your Email"
                type="text"
                {...register("email", {
                  required: "email is required",
                })}
              />
              <p className="text-sm max-md:text-[1.5vw] max-sm:text-[3vw] text-red-500">
                {errors.email?.message}
              </p>
            </div>

            {/* Password Input */}
            <div className="Forpassword m-auto w-full px-3">
              <input
                className="text-[1vw] max-md:text-[1.5vw] max-sm:text-[3vw] border-[#8590A1] rounded-md border-[1px] w-full p-2"
                placeholder="Enter Your Password"
                type="password"
                {...register("password", {
                  required: "password is required",
                })}
              />
              <p className="text-sm max-md:text-[1.5vw] max-sm:text-[3vw] text-red-500">
                {errors.password?.message}
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="termsandconditions-wrapper text-[1vw] max-md:text-[1.5vw] max-sm:text-[3vw] px-3">
              <span>
                By signing up, I accept the Atlassian Cloud Terms of Service
                and acknowledge the Privacy Policy.
              </span>
            </div>

            {/* Submit Button */}
            <div className="button-wrapper w-full flex justify-center">
              <button
                className="text-white bg-blue-400 py-1 rounded-lg w-[15vw] max-md:w-[25vw] max-sm:w-[50vw] text-[1.3vw] max-md:text-[2vw] max-sm:text-[4vw]"
                type="submit"
              >
                Create Account
              </button>
            </div>

            {/* Login Link */}
            <div className="login-navigator-wrapper text-[1vw] max-md:text-[1.5vw] max-sm:text-[3vw] px-3 w-full flex justify-center">
              <span>
                If you already have an account,
                <Link className="text-blue-400" to="/login">
                  login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;