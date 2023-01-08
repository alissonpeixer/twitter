import { HeartIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";

export const Like = ({ tweet, userToken, userId, axios }) => {
  const [likes, setLikes] = useState(tweet.like.length);
  const [isLiked, setIsLiked] = useState(false);
  const setLiked = () => {
    setLikes((prevOld) => prevOld + 1);
    setIsLiked(true);
    apiLike();
  };
  const unLiked = () => {
    setLikes((prevOld) => prevOld - 1);
    setIsLiked(false);
    apiLike();
  };

  const apiLike = async () => {
    await axios(`${import.meta.env.VITE_API_HOST}/like`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${userToken}`,
      },
      data: {
        postId: tweet.id,
      },
    }).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    tweet.like.map((like) => {
      if (like.userId === userId) {
        setIsLiked(true);
      }
    });
  }, [tweet.like]);
  return (
    <div className={`flex space-x-1 text-silver text-sm items-center pt-2`}>
      <div className="flex flex-row">
        <button type="button">
          {isLiked ? (
            <HeartIcon
              className="w-6 h-6 transition-all cursor-pointer  text-red-500  hover:text-red-200"
              weight="fill"
              onClick={unLiked}
            />
          ) : (
            <HeartIcon
              className="w-6 h-6 transition-all cursor-pointer text-red-200 hover:text-red-200"
              onClick={setLiked}
            />
          )}
        </button>
        <div className="pl-2 pt-1">
          {isLiked
            ? likes - 1 === 0
              ? "Só você curtiu isso"
              : `Você e mais ${likes - 1} pessoa curtiram!`
            : `${likes} Like`}
        </div>
      </div>
    </div>
  );
};
