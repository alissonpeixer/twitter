export type  Post = {
    id: string
    is_public?: boolean
    is_delet?: boolean
    is_body: string
    is_title?: string | null
    is_user_avatar: string | null
    is_user_username: string
    user_id: string
    created_at?: string
    updated_at?: string | null
    likes: Likes[]
}