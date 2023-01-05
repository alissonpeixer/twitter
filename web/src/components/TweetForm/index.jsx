import { useFormik } from 'formik'
import axios from 'axios'

const MAX_TWEET_CHAR = 140
export function TweetForm({ loggedInUser, onSuccess, avatar }) {
    const formik = useFormik({
        onSubmit: async (values, form) => {
            await axios({
                method: 'post',
                url: `${import.meta.env.VITE_API_HOST}/tweets`,
                headers: {
                    'authorization': `Bearer ${loggedInUser.token}`
                },
                data: {
                    text: values.text
                },
            })

            form.setFieldValue('text', '')
            onSuccess()
        },
        initialValues: {
            text: ''
        }
    })

    function changeText(e) {
        setText(e.target.value)
    }

    return (
        <div className="p-4 space-y-6">


            <form className="text-lg flex flex-col justify-end items-end bg-white bg-opacity-5 backdrop-blur-lg border p-3 h-28  rounded-2xl" onSubmit={formik.handleSubmit}>
                <textarea
                    name="text"
                    value={formik.values.text}
                    placeholder="O que está acontecendo?"
                    className="bg-transparent outline-none disabled:opacity-50 w-full pr-28"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                />

                <div className="absolute flex items-center gap-4">
                    <span className="text-sm">
                        <span>{formik.values.text.length}</span> / <span className="text-birdBlue">{MAX_TWEET_CHAR}</span>
                    </span>
                    <button
                        type="submit"
                        className="bg-birdBlue px-5 py-2 rounded-full disabled:opacity-50"
                        disabled={formik.values.text.length > MAX_TWEET_CHAR || formik.isSubmitting}
                    >
                        Tweet
                    </button>
                </div>
            </form>
        </div>
    )
}


