import { apiclient } from "@/lib/api-client";
import { useAppstore } from "@/store";
import { GET_MESSAGES } from "@/utils/constants";
import moment from "moment";
import { useRef, useEffect } from "react";

function MessageContainer() {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, selectedChatMessages,setSelectedChatMessages,userInfo } =
    useAppstore();

    useEffect(() => {
      const getMessages = async()=>{
        try {
          const res = await apiclient.post(GET_MESSAGES,{id:selectedChatData._id,userid:userInfo.id},{withCredentials:true})

          if (res.data.messages) {
            setSelectedChatMessages(res.data.messages)
          }
        } catch (error) {
          console.log(error);
          
        }
      }
      if (selectedChatData._id) {
        if (selectedChatType === "contact") {
            getMessages();
        }
      }
      
    }, [selectedChatType, selectedChatData,setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          {selectedChatType === "contact" && renderDmMessage(message)}
        </div>
      );
    });
  };

  const renderDmMessage = (message) => {
    return (
      <div
        className={`${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "border-[#8417ff]/50 bg-[#8417ff]/5 text-[#8417ff]/90"
                : "border-white/20 bg-[#2a2b33]/5 text-white/80"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}

        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessage()}
      <div ref={scrollRef}></div>
    </div>
  );
}

export default MessageContainer;
