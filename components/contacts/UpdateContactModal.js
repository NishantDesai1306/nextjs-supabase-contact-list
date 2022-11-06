import React, { useCallback } from "react";
import { Formik, Form } from "formik";
import { Modal, Button, Input, IconPhone, IconUser, IconMail, IconBriefcase, IconHome } from "@supabase/ui";

export default function UpdateContactModal({ contact, onHide, onConfirm }) {
  const validate = useCallback((values) => {
    const error = {};

    if (!values.phone) {
      error.phone = 'Required';
    } 
    else if (!/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(values.phone)) {
      error.phone = 'Invalid phone number'
    }

    if (!values.name) {
      error.name = 'Required';
    }
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      error.email = 'Invalid email address';
    }
    
    return error;
  }, []);

  return (
    <Modal
      title="Update Contact"
      visible={!!contact}
      onCancel={onHide}
      onConfirm={onConfirm}
      hideFooter
    >
      <Formik
        validate={validate}
        initialValues={{
          ...contact,
        }}
        onSubmit={(values) => onConfirm(values)}
      >
        {({ isSubmitting, touched, setFieldValue, errors, values, handleChange }) => (
          <Form>
            <div className="mb-6">
              <Input
                label="Phone"
                name="phone"
                icon={<IconPhone />}
                value={values.phone}
                onChange={handleChange}
                error={touched.phone && errors.phone}
              />
            </div>

            <div className="mb-6">
              <Input
                label="Name"
                name="name"
                icon={<IconUser />}
                value={values.name}
                onChange={handleChange}
                error={touched.name && errors.name}
              />
            </div>

            <div className="mb-6">
              <Input
                label="Email"
                name="email"
                icon={<IconMail />}
                value={values.email}
                onChange={handleChange}
                error={touched.email && errors.email}
              />
            </div>

            <div className="mb-6">
              <Input
                label="Job Title"
                name="job_title"
                icon={<IconBriefcase />}
                value={values.job_title}
                onChange={handleChange}
                error={touched.job_title && errors.job_title}
              />
            </div>

            <div className="mb-6">
              <Input
                label="Company"
                name="company"
                icon={<IconBriefcase />}
                value={values.company}
                onChange={handleChange}
                error={touched.company && errors.company}
              />
            </div>

            <div className="mb-6">
              <Input.TextArea
                label="Address"
                name="address"
                icon={<IconHome />}
                value={values.address}
                onChange={handleChange}
                error={touched.address && errors.address}
              />
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-500">Profile Picture</label>
              <Input
                className="mt-4"
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={async (e) => {
                  const file = e.target.files[0];

                  setFieldValue('picture', file);
                }}
              />
            </div>

            <Button disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
