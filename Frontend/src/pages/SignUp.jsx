import React from "react";
import google from "../assets/google.jpg";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import {ClipLoader} from "react-spinners";
import { ToastContainer } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { authStart, authSuccess, authFailure } from "../store/authSlice.js";

function SignUp() {
        const [show, setshow] = React.useState(false);
        const navigate = useNavigate();
        const dispatch = useDispatch();

        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [role, setRole] = useState("student");
        const { loading } = useSelector((state) => state.auth);

        const handleSignup = async () => {
          if (!name || !email || !password) {
            toast.error("Please fill in all fields");
            return;
          }
          dispatch(authStart());
          try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`,
              {
                name,
                email,
                password,
                role
              },
              { withCredentials: true }
            );
            console.log(result.data);
            dispatch(authSuccess({ user: result.data.user, token: result.data.token }));
            navigate("/dashboard");
            toast.success("Signup successful!");
          } catch (error) {
            console.error("Error during signup:", error);
            const msg = error.response?.data?.message || "Signup failed. Please try again.";
            dispatch(authFailure(msg));
            toast.error(msg);
          }
        }



    return (
       <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center ">
        <form className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex" onSubmit={(e)=>e.preventDefault()}>
         {/* left div */}
          <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3">
             <div>
              <h1 className="font-semibold text-[black] text-2xl">Let's get Started</h1>
             <h2 className="text-[#999797] text-[18px]">Create your account</h2>
             </div>
             <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
              <label htmlFor="name" className="text-[black] text-sm">Name</label>
              <input type="text" id="name" className="w-full h-10 rounded-md border-[1px] border-[#999797] px-2 focus:outline-none focus:ring-2 focus:ring-[#999797]" placeholder="Enter your name" onChange={(e)=>setName(e.target.value)} value={name}/>
             </div>
             <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
              <label htmlFor="email" className="text-[black] text-sm">Email</label>
              <input type="email" id="email" className="w-full h-10 rounded-md border-[1px] border-[#999797] px-2 focus:outline-none focus:ring-2 focus:ring-[#999797]" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)} value={email}/>
             </div>
             <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative">
              <label htmlFor="password" className="text-[black] text-sm">Password</label>
              <input type={show ? "text" : "password"} id="password" className="w-full h-10 rounded-md border-[1px] border-[#999797] px-2 focus:outline-none focus:ring-2 focus:ring-[#999797]" placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)} value={password} />
              {show ?<FaRegEyeSlash className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]" onClick={()=>setshow(prev=>!prev)}/> :
              <IoMdEye className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]" onClick={()=>setshow(prev=>!prev)}/>}
             </div>
             <div className="flex md:w-[50%] w-[70%] items-center justify-between ">
              <span className={`px-[10px] py-[5px] border-[2px] border-[#e7e6e6] rounded-xl cursor-pointer  ${role === "student" ? 'border-black' : "border-[#646464]"}`} onClick={()=>setRole("student")}>Student</span>
              <span className={`px-[10px] py-[5px] border-[2px] border-[#e7e6e6] rounded-xl cursor-pointer  ${role === "educator" ? 'border-black' : "border-[#646464]"}`} onClick={()=>setRole("educator")}>Educator</span>
             </div>
              <button className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex rounded-[5px] items-center justify-center cursor-pointer" onClick={handleSignup} disabled={loading}>
                {loading ? <ClipLoader size={30} color="white" /> : "Sign Up"}
              </button>
              <div className="w-[80%] flex items-center gap-2">
                <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
                <div className="w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center">or continue</div>
                <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
              </div>
              <div className="w-[80%] h-[40px] border-1 border-[black] rounded-[5px] flex items-center justify-center">
                <img src={google} alt="google" className="w-[25px]" />
                <span>Sign Up with Google</span>
              </div>
              <div className="text-[6f6f6f]">already have an account
                <span className="underline underline-offset-1 text-[blue]"onClick={()=>navigate("/login")}>Login</span>
              </div>
          </div>

          {/* right div */}
          <div className=" w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden">
            <img src="/logo.jpg" alt="logo" className="w-30 show-2xl" />
            <span className="text-2xl text-white">Virtual Course</span>

          </div>
        </form>
        

       </div>
    );
}

export default SignUp;