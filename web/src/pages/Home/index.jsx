import { useEffect, useState } from 'react'

import axios from 'axios'
import avatar from './avatar.png'
import { Tweet } from '../../components/Tweet'
import { TweetForm } from '../../components/TweetForm'
import { SideBar } from '../../components/SideBar'





export function Home({ loggedInUser, tweetId }) {
  const [data, setData] = useState([])


  async function getData() {
    const res = await axios.get(`${import.meta.env.VITE_API_HOST}/tweets`, {
      headers: {
        'authorization': `Bearer ${loggedInUser.token}`
      }
    })
    setData(res.data)
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <main className='flex h-screen'>

      <SideBar avatar={avatar} />

      <div className='flex-1 min-h-screen'>
        <TweetForm loggedInUser={loggedInUser} avatar={avatar} onSuccess={getData} />
        <div className='w-full flex flex-col-reverse'>
          {
            data?.map((item, id) => (
              <Tweet data={item} avatar={avatar} />
            ))
          }
        </div>
      </div>
    </main>
  )
}
