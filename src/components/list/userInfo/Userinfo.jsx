import { useSelector } from "react-redux";
import "./userinfo.css"

const Userinfo = () => {

    const currentUser = useSelector((state) => state.user.currentUser);

    return (
        <div className="userInfo">
            <div className="user">
                <img src={currentUser.avatar || "./favicon.png"} alt="" />
                <h2>{currentUser.username}</h2>
            </div>
            <div className="icons">
            <img src="./more.png" alt="" />
            <img src="./video.png" alt="" />
            <img src="./edit.png" alt="" />
            </div>
        </div>
    )
}

export default Userinfo