import { useState, useEffect, useRef } from 'react'; //to get the AI response to the screen by using state hook

const App = () => {
  const [value, setValue] = useState(""); //user input
  const [message, setMessage] = useState(null); //taking AI response and saving it
  const [previousChats, setPreviousChats] = useState([]); //so that we can save history in array
  const [currentTitle, setCurrentTitle] = useState(null); //null cz we are only saving a text prompt
  const inputRef = useRef(null); // reference to the input field

  const createNewChat = () => { //for new chat we are just clearing everything
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle); //set current title to whatever we clicked on
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => { //going to be async function because we are going to use fetch
    if (!value.trim()) return; // Prevent sending empty messages

    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    };
    try {
      const response = await fetch('https://chatgptclone-2.onrender.com/completions', options);
      const data = await response.json();
      setMessage(data.choices[0].message); //getting message from AI
      //setValue("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      getMessages();
    }
  };

  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value); //we set whatever is the prompt initially to the history title
    } //if we don't have a title but have a value in our input and we do have a message that has come back from AI
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => ( //update an array using useState
          [...prevChats, //open up the array, spill the prev chats out, but also add two objects
            {
              title: currentTitle, //just added a title so we can save it to state
              role: "user",
              content: value
            },
            {
              title: currentTitle,
              role: message.role,  //going in to get the role
              content: message.content //getting the response
            }
          ]//everytime we are saving prev chats, we are saving the prompt we asked, our role as the user and the first prompt of that chat (aka our currentTitle); we are also saving whatever response we get back
      ));
    }
  }, [message, currentTitle]); //basically if when get a message back from openai API this will run
  //console.log(message)
  console.log(previousChats);

  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle); //look are previous individual chats and if the titles match the current title. If it is the same it will all lump into current chats
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title))); //filtering so that we only get unique titles
  console.log(uniqueTitles);

  return (
      <div className="app">
        <section className="side-bar">
          <button onClick={createNewChat}>+ New chat</button>
          <ul className="history">
            {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)} {/*? means if they exist*/}
          </ul>
          <nav>
            <p>Made by Ryan</p>
          </nav>
        </section>
        <section className="main">
          {!currentTitle && <h1>CloneGpt</h1>}
          <ul className="feed">
            {currentChat?.map((chatMessage, index) => <li key={index}> {/*can get current chats and map out each chat message using an index cz we are mapping; we are going to map onto a list item which needs a key; the list has role and content of message*/}
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>)}
          </ul>
          <div className="bottom-section">
            <div className="input-container">
              <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown} // handle keydown event
              /> {/*it is null now but once it changes it will set the value to the var setValue*/}
              <div id="submit" onClick={getMessages}>➢</div> {/*unicode under compart.com (U+27A2) for the sending symbol thing; also onclick is linking a little of back to frontend*/}
            </div>
            <p className="info">
              Clone ChatGPT has a goal to help me learn how to use and integrate APIs better. This took me a whole summer
              and figuring out how to host it on a third party site for both my front and backend took longer.
              Having said this, I am glad I did this project and will strive to learn more.
            </p>
          </div>
        </section>
      </div>
  );
};

export default App;
