import { useEffect, useState } from "react"
import "./chatlist.css"
import AddUser from "./addUser/AddUser.jsx"
import { useDispatch, useSelector } from "react-redux"
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../../../Library/firebase.js"
import { changeChat } from '../../../Library/Store/chatSlice.js'

const ChatList = () => {
    const [chats ,setChats] = useState([])
    const [addMode,setAddMode] = useState(false)
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats;
            const promisses = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                
                const user = userDocSnap.data();


                return { ...item ,user }
            })

            const chatData = await Promise.all(promisses)

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));

        });


        return ()=>{
            unSub()
        }
    },[currentUser.id]);

    const handelSelect = async(chat) => {
        const userChats = chats.map((item) => {
            const {user , ...rest} = item;
            return rest;
        })

        const chatIndex = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        );

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db,'userchats' ,currentUser.id);

        try{

            await updateDoc(userChatsRef,{
                chats:userChats
            })

        }catch(err){
            console.log(err);
        }



        dispatch(changeChat({ chatId: chat.chatId, user: chat.user, currentUser }))
    }


    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="/search.png" alt="" />
                    <input type="text" placeholder="Search" />
                </div>
                <img
                 src={addMode ? "/minus.png":"/plus.png"}
                 alt=""
                 className="add"
                 onClick={() => setAddMode((prev) => !prev)} />
            </div>
            {chats.map((chat) => (
                <div className="item"
                key={chat.chatId}
                onClick={() => handelSelect(chat)}
                style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }}
                >
                    <img src={chat.user.avatar || "./favicon.png"} alt="" />
                    <div className="texts">
                        <span>{chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            {addMode && <AddUser onAdduser={setAddMode}/>}
        </div>
    )
}

export default ChatList