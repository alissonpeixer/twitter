import {
  InboxIcon,
  BellIcon,
  HomeIcon,
  CogIcon,
} from "@heroicons/react/outline";

import Icon from "./Icons";

export const SideBar = ({ avatar }) => {
  const Icons = Icon();

  return (
    <>
      <div className="w-[44vh] flex-row-revers  flex-col bg-[#1D1D1D] justify-between h-screen fixed hidden xl:flex">
        <ul className="p-4 h-full space-y-4">
          <li className="transition-all p-5 flex items-center w-full border gap-2 rounded-xl bg-slate-900/[0.2] hover:scale-105">
            {Icons.glass}
            <span> Buscar</span>
          </li>

          <li className="transition-all p-5 flex items-center w-full border gap-2 rounded-xl bg-slate-900/[0.2] hover:scale-105">
            <InboxIcon width={20} />
            <span>Inbox</span>
          </li>
          <li className="transition-all p-5 flex items-center w-full border gap-2 rounded-xl bg-slate-900/[0.2] hover:scale-105">
            <BellIcon width={20} />
            <span>Notificações</span>
          </li>
        </ul>
        <div className="h-32 flex p-4 justify-around flex-col bg-[#222426] gap-4 z-50 ">
          <div className="flex items-center gap-4">
            <img src={avatar} alt="" />
            <div className="space-x-1">
              <span>Alisson Peixer</span>
              <span className="text-neutral-400">@alissonpx</span>
            </div>
          </div>
          <div className="flex justify-between">
            <HomeIcon width={20} />
            <CogIcon width={20} />
            {Icons.exit}
          </div>
        </div>
      </div>
      <div className="w-[44vh] hidden xl:flex "></div>
    </>
  );
};
