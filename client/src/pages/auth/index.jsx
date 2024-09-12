import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiclient } from "@/lib/api-client.js";
import { useAppstore } from "@/store";

import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const {setUserInfo} = useAppstore();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const validationsignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("password is required");
      return false;
    }
    if (password != confirmpassword) {
      toast.error("password don't matched");
      return false;
    }
    return true;
  };

  const validationlogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("password is required");
      return false;
    }

    return true;
  };

  const handelLogin = async () => {
    if (validationlogin()) {
      const res = await apiclient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }

      );
      console.log(res);
      if (res.data.user.id) {
        setUserInfo(res.data.user)
        toast.success("login successfully...");
        if (res.data.user.profilesetup) {
          navigate("/chat")
        }else{
          navigate("/profile")
        }
      }
    }
  };
  
  const handelSignup = async () => {
    if (validationsignup()) {
      const res = await apiclient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      console.log(res);
      if (res.status===201) {
        setUserInfo(res.data.user)
        toast.success("signup successfully...");
        navigate("/profile");
      }
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl flex flex-col items-center justify-center">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl m-5">Welcome</h1>
              {/* <img src={victory} alt="victory emoji" className="h-[100px]" /> */}
            </div>
            <p className="font-medium text-center">
              {" "}
              Fill in the details to get started with the best chat app!{" "}
            </p>
          </div>

          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full flex justify-center">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>

              <TabsContent className="flex flex-col gap-5 mt-8" value="login">
                <Input
                  value={email}
                  type="email"
                  placeholder="Email"
                  className="rounede-full p-6"
                  onChange={(e) => setemail(e.target.value)}
                />
                <Input
                  value={password}
                  type="password"
                  placeholder="Password"
                  className="rounede-full p-6"
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Button onClick={handelLogin} className="rounded-full p-6">
                  Login
                </Button>
              </TabsContent>

              <TabsContent className="flex flex-col gap-5 " value="signup">
                <Input
                  value={email}
                  type="email"
                  placeholder="Email"
                  className="rounede-full p-6"
                  onChange={(e) => setemail(e.target.value)}
                />
                <Input
                  value={password}
                  type="password"
                  placeholder="Password"
                  className="rounede-full p-6"
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Input
                  value={confirmpassword}
                  type="password"
                  placeholder="Comfirm Password"
                  className="rounede-full p-6"
                  onChange={(e) => setConfirmpassword(e.target.value)}
                />
                <Button onClick={handelSignup} className="rounded-full p-6">
                  SignUp
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
