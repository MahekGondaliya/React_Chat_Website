import { useAppstore } from "@/store";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import ChatContainer from "./components/chat-container";
import ContactContainer from "./components/contact-container";
import EmptyContainer from "./components/empty-chat-container";

function Chat() {
  const { userInfo, selectedChatType } = useAppstore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profilesetup) {
      toast("Please fill profile setup..");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] text-white overflow-hidden ">
      <ContactContainer></ContactContainer>

      {selectedChatType === undefined ? (
        
        <EmptyContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}

export default Chat;
