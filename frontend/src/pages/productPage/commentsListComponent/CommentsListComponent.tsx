import { UseFormRegister, FieldValues, Path, UseFormHandleSubmit } from "react-hook-form";
import { Comment } from "../../../types"

interface CommentsListComponentProps<T extends FieldValues>{
    comments: Comment[];
    userEmail: string;
    className: string;
    register: UseFormRegister<T>;
    name: Path<T>;
    handleSubmit: UseFormHandleSubmit<T>;
    onSubmit: (data: T) => void;
    error?: string;
}

export const CommentsListComponent = <T extends FieldValues>({ comments, userEmail, className, register, name, handleSubmit, onSubmit, error }: CommentsListComponentProps<T>) => {
    return (
        <div className={className}>
            {comments.length > 0 ? (
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index} className={`flex  rounded-lg p-4 ${comment.user.email === userEmail ? 'border-2 border-violet' : 'border'}`}>
                            <div className="flex flex-col items-center">
                                                    <img
                                                        src={import.meta.env.VITE_BASE_URL + comment.user.imagePath}
                                                        alt={`${comment.user.firstName} avatar`}
                                                        className="w-16 h-16 rounded-full mb-2"
                                                    />
                                                    <p className="font-semibold text-center">{comment.user.firstName}</p>
                                                    <p className="text-sm text-gray-500 text-center">
                                                        {new Date(comment.createdAt).toLocaleString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>

                                                <div className="w-3/4 pl-6">
                                                    <p>{comment.content}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                                <form className="flex flex-col mt-12" onSubmit={handleSubmit(onSubmit)}>
                                    <textarea
                                        className="border border-violet border-opacity-60 rounded-xl px-3 py-2"
                                        {...register(name)}
                                    />
                                    {error && <p className="text-red">{error}</p>}
                                    <button type="submit" className="bg-violet text-white p-3 w-64 rounded-xl self-center mt-4">
                                        Leave comment
                                    </button>                  
                                </form>
                            </div>
    )
}