import React, { useEffect } from "react";
import { CheckUser } from "../../assets/icons/Icon";
import Img from "../Img/Img";

import "../../sass/user.scss";
import { useDispatch, useSelector } from "react-redux";
import { getFollows, getUsers, setFollow, unFollow } from "../../redux/thunk";
import { useNavigate } from "react-router-dom";

const User = ({ res }) => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const users = useSelector((state) => state.users);
    const followings = useSelector((state) => state.followings);

    currentUser = users.find((user) => user.email === currentUser?.email);

    const followingUser = followings.find(
        (following) =>
            following.user_id === currentUser?.id &&
            following.user_id_following === res?.id
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getUsers());
        dispatch(getFollows());
    }, [users.length, followings.length]);

    const handleFollow = (action, e) => {
        e.stopPropagation();
        if (!currentUser?.id) {
            navigate("/login");
        } else {
            if (action === "follow") {
                dispatch(
                    setFollow({
                        user_id: currentUser?.id,
                        user_id_following: res?.id,
                    })
                );
            } else {
                dispatch(unFollow(followingUser?.id));
            }
        }
    };

    const handleNavigate = () => {
        navigate(`/profile/${res?.id}`);
    };

    return (
        <div className="who-follow-user" onClick={handleNavigate}>
            <Img url={res?.user_img} className="who-follow-user-img" />
            <div className="who-follow-user-wrapper">
                <div className="who-follow-user-text">
                    <div className="who-follow-user-text-name">
                        <p>{res?.user_name}</p>
                        <span>
                            <CheckUser color="var(--primary-color)" />
                        </span>
                    </div>
                    <p>{res?.nick_name}</p>
                </div>
                {currentUser?.email !== res?.email ? (
                    res?.id === followingUser?.user_id_following &&
                    currentUser?.id === followingUser?.user_id ? (
                        <button
                            className="unfollow-btn"
                            onClick={(e) => handleFollow("unfollow", e)}
                        >
                            Unfollow
                        </button>
                    ) : (
                        <button
                            className="follow-btn"
                            onClick={(e) => handleFollow("follow", e)}
                        >
                            Follow
                        </button>
                    )
                ) : null}
            </div>
        </div>
    );
};

export default User;
