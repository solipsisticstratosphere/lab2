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
        <Form className="form">
          <div className="field-wrapper">
            <label htmlFor="username" className="label">
              Username
            </label>
            <Field type="text" name="username" className="input-field" />
            <ErrorMessage name="username" component="div" className="error" />
          </div>
          <button type="submit" disabled={isSubmitting} className="button">
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default UserNameForm;
