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
        <Form className="form">
          <div className="field-wrapper">
            <Field
              type="text"
              name="message"
              placeholder="Type your message..."
              className="input-field"
            />
            <ErrorMessage name="message" component="div" className="error" />
          </div>
          <button type="submit" disabled={isSubmitting} className="button">
            Send
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default MessageForm;
