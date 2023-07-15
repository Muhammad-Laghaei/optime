import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";

//types
interface CommentType {
  id: number;
  name: string;
  message: string;
  replyMessages?: Omit<CommentType, "replyMessages">[];
}
interface Props {
  comment: CommentType;
  replyToCommentHandler?: (id: number) => void;
  showMoreHandler?: (id: number) => void;
  removeCommentHandler: (id: number, parentId?: number) => void;
  parentId?: number;
}

const Comment = (props: Props) => {
  //props
  const {
    comment,
    showMoreHandler,
    replyToCommentHandler,
    removeCommentHandler,
    parentId,
  } = props;

  //JSX
  return (
    <Card
      sx={{
        backgroundColor: parentId ? "#F2FAFD" : "#E8E9EB",
      }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {comment.name}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {comment.message}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          onClick={() => removeCommentHandler(comment.id, parentId)}
          aria-label="reply"
          size="small"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
        {parentId === undefined && (
          <IconButton
            onClick={() =>
              replyToCommentHandler && replyToCommentHandler(comment.id)
            }
            aria-label="reply"
            size="small"
          >
            <ReplyIcon />
          </IconButton>
        )}
        {comment.replyMessages && comment.replyMessages.length > 0 && (
          <Button
            onClick={() => showMoreHandler && showMoreHandler(comment.id)}
          >
            {"نمایش پاسخ ها"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Comment;
