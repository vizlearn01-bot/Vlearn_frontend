import React from "react";
import { useMessagesContext } from "../context-providers/MessagesContextProvider";
import Notification from "./Notification";

const NotificationBar = () => {
    const messagesContext = useMessagesContext();

    return (
        <div className="flex w-72 sm:w-96 fixed top-0 right-0 z-50">
            {Boolean(messagesContext?.messages.length > 0) && (
                <div className="flex w-full flex-col space-y-2 m-3">
                    {messagesContext.messages.map((message, index) => (
                        <Notification
                            key={index}
                            severity={message.severity}
                            title={message.title}
                            message={message.message}
                            onDismiss={() => {
                                messagesContext?.removeMessage(message);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationBar;
