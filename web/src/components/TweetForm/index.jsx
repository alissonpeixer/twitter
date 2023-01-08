import { useFormik } from "formik";
import axios from "axios";
export const TweetForm = ({ userToken, avatar, getData }) => {
  const MAX_TWEET_CHAR = 140;
  const formik = useFormik({
    onSubmit: async (values, form) => {
      await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_HOST}/post`,
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        data: {
          text: values.text,
        },
      }).then((data) => getData());

      form.setFieldValue("text", "");
    },
    initialValues: {
      text: "",
    },
  });

  return (
    <div className="border-b border-silver p-4 space-y-6">
      <div className="flex space-x-5">
        <img src={avatar} className="w-7" />
        <h1 className="font-bold text-xl">Página Inicial</h1>
      </div>

      <form
        className="pl-12 text-lg flex flex-col"
        onSubmit={formik.handleSubmit}
      >
        <textarea
          name="text"
          value={formik.values.text}
          placeholder="O que está acontecendo?"
          className="bg-transparent outline-none disabled:opacity-50"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />

        <div className="flex justify-end items-center space-x-3">
          <span className="text-sm">
            <span>{formik.values.text.length}</span> /{" "}
            <span className="text-birdBlue">{MAX_TWEET_CHAR}</span>
          </span>
          <button
            type="submit"
            className="bg-birdBlue  px-5 py-2 rounded-full disabled:opacity-20"
            disabled={
              formik.values.text.length > MAX_TWEET_CHAR || formik.isSubmitting
            }
          >
            <span className="text-white">Enviar</span>
          </button>
        </div>
      </form>
    </div>
  );
};
