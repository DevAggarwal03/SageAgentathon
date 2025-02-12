import { useState } from "react";

const Chatbot = () => {
    const [message, setMessage] = useState<string>('');
    const [response, setResponse] = useState<string>('');

    const sendMessage = async (message: string) => {
        const response = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: message }),
        });
        const data = await response.json();
        setResponse(data.response);
        console.log(data.response);
      };
      
    return ( <div>
        <input type="text" onChange={(e) => setMessage(e.target.value)} />
        <button onClick={() => {console.log("clicked");sendMessage(message)}}>Send</button>
        <div>{response}</div>
    </div> );
}
 
export default Chatbot;