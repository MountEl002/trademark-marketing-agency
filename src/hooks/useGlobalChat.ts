// hooks/useGlobalChat.ts

let globalChatActions: {
  openChat?: () => void;
  setSystemMessage?: (message: string) => void;
  setSGMSender?: (sender: "user" | "admin") => void;
} = {};

export const useGlobalChat = () => {
  return {
    openChat: () => globalChatActions.openChat?.(),
    sendSystemMessage: (message: string, sender: "user" | "admin") => {
      globalChatActions.openChat?.();
      globalChatActions.setSystemMessage?.(message);
      globalChatActions.setSGMSender?.(sender);
    },
  };
};

export const registerChatActions = (actions: {
  openChat: () => void;
  setSystemMessage: (message: string) => void;
  setSGMSender?: (sender: "user" | "admin") => void;
}): void => {
  globalChatActions = actions;
};

export const unregisterChatActions = (): void => {
  globalChatActions = {};
};
