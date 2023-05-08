import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect, useRef } from 'react';

type TProps = {
    onSubmit: (inputValue: string) => void;
}

const ChatInput = ({onSubmit}: TProps) => {
    const [inputValue, setInputValue] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: any) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        if (textAreaRef.current) {
            const textAreaElement = textAreaRef.current;
            textAreaElement.style.height = 'auto';
            const newHeight = Math.min(Math.max(textAreaElement.scrollHeight, 50), 200);
            textAreaElement.style.height = `${newHeight}px`;
        }
    }, [inputValue]);

    return (
        <div className="relative flex w-full shadow-[0px_0px_8px_-1px_rgba(0,0,0,0.25)] rounded-lg">
          <textarea
              ref={textAreaRef}
              className="w-full h-24 p-4 m-0 resize-none outline-none overflow-hidden"
              tabIndex={0}
              style={{maxHeight: '200px', minHeight: '50px'}}
              rows={1}
              placeholder="Send a message."
              value={inputValue}
              onChange={handleChange}
              onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (inputValue.trim().length > 0) {
                            setInputValue('');
                            onSubmit && onSubmit(inputValue);
                        }
                    }
              }}
          />
          <div className="w-8 mr-4 h-full flex items-center justify-center">
            <PaperAirplaneIcon className="w-4 h-4 cursor-pointer" />
          </div>
        </div>
    );
};

export default ChatInput;
