import { useState,useEffect } from "react";
import { Grid, TextField, Button, Typography } from "@mui/material";

//types
interface Props {
  submitHandler: (
    event: React.FormEvent<HTMLFormElement>,
    name: string,
    message: string,
    isReplyMessage: boolean
  ) => void;
  isReplyMessage: boolean;
  replyedMessageId: number | null;
}

// we can use react-hook-form and control form
const CommentForm = (props: Props) => {
  //states
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  //props
  const { submitHandler, isReplyMessage, replyedMessageId } = props;

  //effect
  useEffect(() => {
    setMessage('')
    setName("");
  }, [replyedMessageId]);

  //JSX
  return (
    <form
      onSubmit={(event) => submitHandler(event, name, message, isReplyMessage)}
    >
      <Typography
        sx={{ margin: "0 0 15px 0" }}
        variant="h6"
        color="text.secondary"
      >
        {!isReplyMessage ? "ایجاد نظر جدید" : "پاسخ به نظر"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
            label="نام"
            value={name}
            type="text"
            fullWidth
            autoFocus
          />
        </Grid>
        <Grid item xs={6.5}>
          <TextField
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMessage(event.target.value);
            }}
            label="پیام"
            value={message}
            type="text"
            fullWidth
          />
        </Grid>
        <Grid sx={{ margin: "auto" }} item xs={1.5}>
          <Button type="submit" variant="contained" color="primary">
            {"ارسال"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CommentForm;
