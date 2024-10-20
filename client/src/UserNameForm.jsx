// UserNameForm.jsx

import { Formik, Form, Field, ErrorMessage } from "formik";

const UserNameForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{ username: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.username) {
          errors.username = "Required";
        } else if (values.username.length > 15) {
          errors.username = "Must be 15 characters or less";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values.username);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="username">Username</label>
            <Field type="text" name="username" />
            <ErrorMessage
              name="username"
              component="div"
              style={{ color: "red" }}
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default UserNameForm;
