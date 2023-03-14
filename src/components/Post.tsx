import { format, formatDistanceToNow } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';

import { Avatar } from './Avatar';
import { Comment } from './Comment';

import styles from './Post.module.css';

interface Author {
    name: string;
    role: string;
    avatarUrl: string;
}

interface Content {
    type: 'paragraph' | 'link';
    content: string;
}

export interface PostType {
    id: number;
    author: Author;
    publishedAt: Date;
    content: Content[];
}

interface PostProps {
    post: PostType;
}


export function Post ({post}:PostProps) {
    const [comments, setComments] = useState(['Post top, hein?'])
    const [newCommentText, setNewCommentText] = useState('')
    const [newCustomValidaty, setCustomValidity] = useState('');

    const publishedDateFormatted = format(post.publishedAt, "d 'de' LLL 'as' HH:mm'h'", {
        locale: ptBr,
    })

    const publishedDateRelativeToNow = formatDistanceToNow(post.publishedAt, {
        locale: ptBr,
        addSuffix: true
    })

    function handleAddComments (event:FormEvent) {
        event.preventDefault();

        setComments([...comments, newCommentText]);
        setNewCommentText('');
    }

    function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>){
        event.target.setCustomValidity('');
        setNewCommentText(event.target.value);
    }

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('Esse campo é obrigatório')
    }

    function deleteComment(commentToDelete: string){
        const newListOfCommentWithoutDeletedOne = comments.filter(comment => {
            return comment !== commentToDelete;
        })

        setComments(newListOfCommentWithoutDeletedOne);
    }

    //if textarea has no letter the btn publish will be disabled//
    const isNewCommentEmpty = newCommentText.length === 0;

    return (
        <article className={styles.post}>
            <header className={styles.postHeader}>
                <div className={styles.author}>
                    <Avatar hasBorder={true} src={post.author.avatarUrl} />
                    <div className={styles.authorInfo}>
                        <strong>{post.author.name}</strong>
                        <span>{post.author.role}</span>
                    </div>
                </div>
            
                <time 
                    title={publishedDateFormatted} 
                    dateTime={post.publishedAt.toISOString()}>
                        {publishedDateRelativeToNow}
                </time>
            </header>

            <div className={styles.content}>
                {post.content.map(line => {
                    if (line.type == 'paragraph') {
                        return <p key={line.content}>{line.content}</p>
                    } else if (line.type == 'link') {
                        return <p key={line.content}><a href='#'>{line.content}</a></p>
                    }
                })}
            </div>

            <form onSubmit={handleAddComments} className={styles.commentForm}>
                    <strong>Deixe um comentário</strong>

                    <textarea 
                        name='comment'
                        placeholder='Deixe um comentário'
                        onChange={handleNewCommentChange}
                        value={newCommentText}
                        onInvalid={handleNewCommentInvalid}
                        required
                    />

                <footer>
                    <button type='submit' disabled={isNewCommentEmpty}>Publicar</button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map(comment => {
                    return (
                        <Comment 
                            key={comment}
                            content={comment} 
                            onDeleteComment={deleteComment}
                        />
                    )
                })}
            </div>
        </article>
    )
}