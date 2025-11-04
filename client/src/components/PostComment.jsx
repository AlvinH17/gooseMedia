import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import TimeAgo from "react-timeago";

const PostComment = ({ comment, onDeleteComment }) => {
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);

  // function to delete comment
  const deleteComment = () => {
    onDeleteComment(comment?._id);
  };

  return (
    <li className="singlePost__comment">
      <div className="singlePost__comment-wrapper">
        <div className="singlePost__comment-author">
          <img src={comment?.creator?.creatorPhoto} alt="" />
        </div>
        <div className="">
          {/* singlePost__fcomment-body */}
          <div>
            <h5>{comment?.creator?.creatorName}</h5>
            <small>
              <TimeAgo date={comment?.createdAt} />
            </small>
          </div>
          <p>{comment?.comment}</p> {/* This displays the comment text */}
        </div>
      </div>
      {userId == comment?.creator?.creatorId && (
        <button className="" onClick={deleteComment}>
          {/* singlePost__comment-delete-btn */}
          <FaRegTrashAlt />
        </button>
      )}
    </li>
  );
  //   return <div>PostComment</div>;
};

export default PostComment;
