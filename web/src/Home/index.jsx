import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import avatar from "./avatar.png";

import { TweetForm } from "../components/TweetForm";
import { Tweet } from "../components/Tweet";

import { SideBar } from "../components/SideBar";

export function Home({ userToken, userId }) {
  useEffect(() => {
    document.title = "AzTwitt | Home";
  }, []);

  const [data, setData] = useState([]);

  async function getData() {
    const resPost = await axios
      .get(`${import.meta.env.VITE_API_HOST}/post`, {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("user");
          location.reload();
        }
      });

    setData(resPost.data);
  }
  useEffect(() => {
    getData();
  }, []);
  console.log(data);
  return (
    <>
      <div className="flex flex-row min-h-screen bg-[#1D1D1D]">
        <SideBar avatar={avatar} />

        <div className="flex-1  w-auto bg-[#222426] shadow-2xl  p-4">
          <TweetForm userToken={userToken} avatar={avatar} getData={getData} />

          <div>
            <AnimatePresence className="flex flex-col  max-w-auto">
              {data.length &&
                data.map((tweet, id) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Tweet
                      tweet={tweet}
                      avatar={avatar}
                      userToken={userToken}
                      userId={userId}
                      setData={setData}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
