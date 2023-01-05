import { HomeIcon } from '@heroicons/react/outline'


export const SideBar = ({ avatar }) => {
    return (
        <div className="min-h-full w-[14%] border-r flex justify-end flex-col">
            <div className="flex-1">
                <ul className="h-full space-y-2">
                    <li className="cursor-pointer h-10 flex items-center">
                        <HomeIcon className='w-5 h-5' />
                        <div>
                            Home
                        </div>
                    </li>
                    <li className="p-4 cursor-pointer">Buscar</li>
                </ul>
            </div>
            <div className="border-t p-4 flex flex-col">
                <div className="p-1 flex items-center gap-3 h-16">
                    <img src={avatar} alt="" width={25} />
                    Alisson Peixer
                </div>
                <button className="w-full border p-1 rounded-3xl">
                    SAIR
                </button>
            </div>
        </div>
    )
}