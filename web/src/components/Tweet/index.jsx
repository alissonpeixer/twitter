import axios from "axios";
import { useState } from "react";

import { Like } from "./Like";
import { Menu } from "./Menu";

export const Tweet = ({ tweet, avatar, userToken, userId, setData }) => {
  const [menu, setMenu] = useState(false);
  const openMenu = () => {
    if (menu) {
      setMenu(false);
      return;
    }
    setMenu(true);
  };

  return (
    <div className="flex justify-between p-4 border-b border-silver/[0.1]">
      <div className="flex space-x-3">
        <div>
          <img src={avatar} />
        </div>
        <div className="space-y-2">
          <span className="font-bold text-sm">{tweet.user.name}</span>{" "}
          <span className="font-bold text-sm">{tweet.user.surname}</span>{" "}
          <span className="text-sm text-silver">@{tweet.user.username}</span>
          <div className=" w-60 break-words ">{tweet.text}</div>
          <footer>
            <Like
              tweet={tweet}
              userToken={userToken}
              userId={userId}
              axios={axios}
            />
          </footer>
        </div>
      </div>
      {tweet.user.id === userId && (
        <Menu
          menu={menu}
          openMenu={openMenu}
          setData={setData}
          tweet={tweet}
          axios={axios}
          userToken={userToken}
        />
      )}
    </div>
  );
};
