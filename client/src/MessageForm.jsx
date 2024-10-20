import { Formik, Form, Field, ErrorMessage } from "formik";

const MessageForm = ({ onSend }) => {
  return (
    <Formik
      initialValues={{ message: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.message) {
          errors.message = "Required";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        onSend(values.message);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <Field
              type="text"
              name="message"
              placeholder="Type your message..."
            />
            <ErrorMessage
              name="message"
              component="div"
              style={{ color: "red" }}
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Send
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default MessageForm;
