import { create } from "zustand";
import { createAuthslice } from "./slices/auth-slice";
import { createChatSlice } from "./slices/chat-slice";

export const useAppstore = create()((...a)=>({
...createAuthslice(...a),
...createChatSlice(...a),
}));