import { AvatarImage } from "@/components/ui/avatar";
import { colors, getcolor } from "@/lib/utils";
import { useAppstore } from "@/store";
import { Avatar } from "@radix-ui/react-avatar";
import React, { useState, useEffect, useRef } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiclient } from "@/lib/api-client";
import { ADD_PROFILE_IMG, REMOVE_PROFILE_IMG, UPDATE_PROFILE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { HOST } from "@/utils/constants";

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppstore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);
  const user = userInfo.id;

  useEffect(() => {
    if (userInfo.profilesetup) {
      setFirstName(userInfo.firstname);
      setLastName(userInfo.lastname);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`)
    }
  }, [userInfo]);

  const ValidateProfile = () => {
    if (!firstName || !lastName) {
      toast("Enter firstName or LastName.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (ValidateProfile()) {
      try {
        // const user = userInfo.id;
        const res = await apiclient.post(
          UPDATE_PROFILE,
          {
            firstname: firstName,
            lastname: lastName,
            color: selectedColor,
            user,
          },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data) {
          setUserInfo({ ...res.data });
          toast.success("Update successfully....");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handalnavigate = () => {
    if (userInfo.profilesetup) {
      navigate("/chat");
    } else {
      toast("Please complete your profile ");
    }
  };

  const handleFileInput = () => {
    fileInputRef.current.click();
  };

  const handelImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image" , file)
      formData.append("userId", user); 
      const res = await apiclient.post(ADD_PROFILE_IMG,formData,{withCredentials:true})
      if (res.status===200 && res.data.image) {
        setUserInfo({...userInfo , image: res.data.image});
        toast.success("image upload successfully......")
      }
    }
  };

  const handeldeleteimg = async () => {
    try {
      const res = await apiclient.delete(REMOVE_PROFILE_IMG,{withCredentials:true});

      if (res.status === 200) {
        setUserInfo({...userInfo,image:null});
        toast("Profile image is deleted");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
      
    }
  };
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 ">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            onClick={handalnavigate}
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer "
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden ">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getcolor(
                    selectedColor
                  )}`}
                >
                  {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full "
                onClick={image ? handeldeleteimg : handleFileInput}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer"></FaTrash>
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer"></FaPlus>
                )}
              </div>
            )}
            <Input type="file" ref={fileInputRef} className="hidden" onChange={handelImageChange} name="profile-image" accept=".png, .jpg, .jpeg"></Input>

          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5  text-white items-center justify-center ">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
              ></Input>
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name "
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
              ></Input>
            </div>

            <div className="w-full">
              <Input
                placeholder="Last Name "
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
              ></Input>
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color}  ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-1 "
                      : "  "
                  }h-8 w-8 rounded-full cursor-pointer transition-all duration-300`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-800 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
