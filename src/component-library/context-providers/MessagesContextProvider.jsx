import React from "react";

export const MessagesContext = React.createContext(null);

export const useMessagesContext = () => {
    return React.useContext(MessagesContext);
};

export const showResponseMessage = (response, messagesContext) => {
    if (response.responseCode === 200 || response.responseCode === 201) {
        if (response.responseData?.message) {
            messagesContext?.addMessage(
                messagesContext?.createMessage(
                    "Success",
                    response.responseData?.message,
                    "success"
                )
            );
        }
    } else {
        if (response.responseData?.errors?.detail) {
            messagesContext?.addMessage(
                messagesContext?.createMessage(
                    "Error",
                    response.responseData?.errors?.detail,
                    "error"
                )
            );
        }
    }
};

const MessagesContextProvider = ({ children }) => {
    const [messages, setMessages] = React.useState([]);

    const addMessage = (message) => {
        setMessages((messages) => [...messages, message]);
    };

    const addMultipleMessages = (multipleMessage) => {
        setMessages((messages) => [...messages, ...multipleMessage]);
    };

    const removeMessage = (message) => {
        setMessages((messages) => {
            let newState = messages.filter(
                (m) => m.message !== message.message
            );
            return [...newState];
        });
    };

    const clearMessages = () => {
        setMessages([]);
    };

    const createMessage = (title, message, severity) => {
        const obj = {};
        obj.title = title;
        obj.message = message;
        obj.severity = severity;
        return obj;
    };

    return (
        <MessagesContext.Provider
            value={{
                messages,
                createMessage,
                addMessage,
                addMultipleMessages,
                removeMessage,
                clearMessages,
            }}
        >
            {children}
        </MessagesContext.Provider>
    );
};

export default MessagesContextProvider;
