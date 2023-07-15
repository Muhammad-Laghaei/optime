import { useState, useEffect, useRef, useCallback } from "react";
// UI
import { Box } from "@mui/material";
import { ClickAwayListener } from "@mui/base";
// DATA
import { mockData } from "../data";
//Components
import Comment from "../components/comment";
import CommentForm from "../components/commentForm";

//types
export interface CommentType {
  id: number;
  name: string;
  message: string;
  replyMessages?: Omit<CommentType, "replyMessages">[];
}
interface ShoMore {
  [key: number]: boolean;
}
const Comments = () => {
  //variables
  const [showMore, setShowMore] = useState<ShoMore>({});
  const [data, setData] = useState<CommentType[]>(mockData);
  const [replyedMessageId, setReplyedMessageId] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const latestId = useRef(27);
  const observer = useRef<IntersectionObserver | null>(null);
  const Url = "";

  // handlers
  const showMoreHandler = (id: number) => {
    const newShomMore = { ...showMore };
    if (showMore[id]) {
      newShomMore[id] = !newShomMore[id];
    } else {
      newShomMore[id] = true;
    }
    setShowMore(newShomMore);
  };
  const replyToCommentHandler = (id: number) => {
    setReplyedMessageId(id);
  };
  const handleClickAway = () => {
    setReplyedMessageId(null);
  };
  const submitCommentHandler = (
    event: React.FormEvent<HTMLFormElement>,
    name: string,
    message: string,
    isReplyMessage: boolean
  ) => {
    event.preventDefault();
    const newData = [...data];
    const newComment: CommentType = {
      id: latestId.current,
      name,
      message,
    };
    if (isReplyMessage) {
      const replyedMessage = newData.find((comment) => {
        return comment.id == replyedMessageId;
      });
      replyedMessage?.replyMessages?.push(newComment);
    } else {
      newComment.replyMessages = [];
      newData.push(newComment);
    }
    const newHasMore = newData.length > pageNumber * 10;
    if (newHasMore) setHasMore(newHasMore);
    setData(newData);
    setReplyedMessageId(null);
    latestId.current = latestId.current + 1;
  };

  const removeCommentHandler = (id: number, parentId: number | undefined) => {
    const oldData = [...data];
    if (parentId) {
      const foundParentIndex = oldData.findIndex((comment) => {
        return comment.id == parentId;
      });
      const foundChildIndex = oldData[
        foundParentIndex
      ].replyMessages?.findIndex((replyMessage) => {
        return replyMessage.id == id;
      });
      if (foundChildIndex !== undefined) {
        oldData[foundParentIndex].replyMessages?.splice(foundChildIndex, 1);
      }
    } else {
      const foundIndex = oldData.findIndex((comment) => {
        return comment.id == id;
      });
      oldData.splice(foundIndex, 1);
    }
    setData(oldData);
  };

  // get data request example
  const getData = async () => {
    // we can use then.catch instead of this logic and that logic is better performance becouse we don't use await in that logic
    // i use just GET method but we can use POST and DELETE methods for create and remove API
    try {
      // we can use axios instead
      const response = await fetch(Url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
        // body: for pass data
      });
      const newData = JSON.parse(response.toString()).data;
      setData(newData);
    } catch (error) {
      console.log(error);
    }

    const newHasMore = data.length > pageNumber * 10;
    setHasMore(newHasMore);
  };

  // infinity scroll logic
  const lastCommentElementRef = useCallback(
    (node: HTMLElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  // effect

  useEffect(() => {
    if (Url) {
      getData();
    }
    const newHasMore = data.length > pageNumber * 10;
    setHasMore(newHasMore);
  }, [pageNumber]);

  //JSX

  return (
    <>
      <Box
        sx={{
          width: "70%",
          margin: "0 auto",
          padding: "20px",
          border: "black solid 1px",
          borderRadius: "20px",
        }}
      >
        <CommentForm
          submitHandler={submitCommentHandler}
          isReplyMessage={false}
        />
      </Box>
      {data
        .slice(0, pageNumber * 10)
        .map((comment: CommentType, index: number) => {
          // we can add this part in another component for better readability
          return (
            <Box
              ref={pageNumber * 10 === index + 1 ? lastCommentElementRef : null}
              sx={{
                padding: "10px",
                margin: "10px auto",
                width: "50%",
              }}
              key={comment.id}
            >
              <Comment
                showMoreHandler={showMoreHandler}
                replyToCommentHandler={replyToCommentHandler}
                comment={comment}
                removeCommentHandler={removeCommentHandler}
              />
              {replyedMessageId == comment.id && (
                <ClickAwayListener onClickAway={handleClickAway}>
                  <Box
                    sx={{
                      // width: "50%",
                      margin: "2px auto",
                      padding: "20px",
                      borderBottom: "black solid 1px",
                    }}
                  >
                    <CommentForm
                      isReplyMessage={true}
                      submitHandler={submitCommentHandler}
                    />
                  </Box>
                </ClickAwayListener>
              )}
              {showMore[comment.id] &&
                comment.replyMessages?.map(
                  (replyMessage: Omit<CommentType, "replyMessages">) => {
                    return (
                      <Box
                        sx={{ padding: "10px 100px 0 0" }}
                        key={replyMessage.id}
                      >
                        <Comment
                          comment={replyMessage}
                          removeCommentHandler={removeCommentHandler}
                          parentId={comment.id}
                        />
                      </Box>
                    );
                  }
                )}
            </Box>
          );
        })}
    </>
  );
};

export default Comments;
