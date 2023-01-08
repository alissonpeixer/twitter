import { TrashIcon, XIcon } from "@heroicons/react/outline";
import { CSSTransition } from "react-transition-group";
export const Menu = ({ menu, openMenu, setData, tweet, axios, userToken }) => {
  const delet = async () => {
    setData((prevOld) => prevOld.filter((item) => item.id !== tweet.id));

    // feacha o menu quando excluido
    openMenu();

    await axios(`${import.meta.env.VITE_API_HOST}/post/delete`, {
      method: "delete",
      headers: {
        authorization: `Basic ${userToken}`,
      },
      data: {
        postId: tweet.id,
      },
    }).then((res) => {
      console.log(res);
    });
  };

  return (
    <div>
      <button onClick={openMenu}>
        {menu ? (
          <XIcon className="w-6 h-6" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        )}
      </button>
      <CSSTransition
        in={menu}
        timeout={400}
        classNames="list-transition"
        unmountOnExit
        appear
      >
        <div
          className={` absolute  flex-col bg-slate-400/[0.4] rounded-tr-none rounded-xl w-32 h-10 items-center justify-center transition-all flex right-7`}
        >
          <button
            className="transition-all flex cursor-pointer hover:text-sky-400"
            onClick={delet}
          >
            <TrashIcon className="w-5" /> Excluir
          </button>
        </div>
      </CSSTransition>
    </div>
  );
};

// className={` absolute  flex-col bg-slate-400/[0.4] rounded-tr-none rounded-xl w-32 h-10 items-center justify-center ${
//   menu
//     ? "transition-all flex right-7 "
//     : "transition-all hidden right-0"
// } `}
