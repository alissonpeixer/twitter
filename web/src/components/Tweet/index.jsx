import { useState } from "react"
import { HeartIcon, TrashIcon } from '@heroicons/react/outline'





export function Tweet({ data, avatar }) {

    const [likes, setLikes] = useState(0)
    const [stateLike, setStateLike] = useState(false)
    const like = () => {
        stateLike ? (
            setLikes(old => old - 1),
            setStateLike(false)
        ) :
            (setLikes(old => old + 1),
                setStateLike(true))
    }
    return (
        <div className="flex space-x-3 p-4 border-b border-silver">
            <div>
                <img src={avatar} />
            </div>
            <div >
                <span className="font-bold text-sm">{data.user.name}</span>{' '}
                <span className="text-sm text-silver">@{data.user.username}</span>


                <p>{data.text}</p>
                <div className="flex space-x-1 text-silver text-sm items-center justify-between ">
                    <div className="flex space-x-1 items-center">
                        <HeartIcon className="w-6 stroke-1" onClick={() => like()} />
                        <span>{likes}</span>
                    </div>
                    <div>
                        <TrashIcon className="w-6 stroke-1" onClick={() => like()} />
                    </div>
                </div>
            </div>

        </div>
    )
}