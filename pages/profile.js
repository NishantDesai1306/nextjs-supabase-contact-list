import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { Button, IconAlertCircle, IconMail, IconTrash, Input, Modal, Space, Typography } from "@supabase/ui";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const user = useUser();
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const deleteAccount = useCallback(async () => {
    setIsDeletingAccount(true);

    try {
      const { user } = await fetch("/api/delete-account", { method: "POST" })
        .then((res) => res.json());

      if (user) {
        router.push({
          pathname: "/login",
        });
      }
    }
    catch (e) {
      console.log(e);
    }
    finally {
      setIsDeletingAccount(false);
    }
  }, [router]);

  return (
    <div className="w-full h-full bg-gray-300 flex flex-col">
      <Navbar />

      <div className="w-full flex-grow flex flex-col items-center p-4 mt-16 mx-auto">
        <div className="mt-16 p-4 border-2 border-emerald-500 bg-white rounded" style={{ width: 500 }}>
          <div className="text-3xl mb-6">
            Account Details
          </div>

          <div className="mb-6">
            <Input
              label="Email"
              name="email"
              icon={<IconMail />}
              value={user.email}
              disabled
            />
          </div>

          <div>
            <Button
              block
              danger
              size="large"
              icon={<IconTrash />}
              loading={isDeletingAccount}
              disabled={isDeletingAccount}
              onClick={() => setShowDeleteConfirmModal(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="Are you sure?"
        visible={showDeleteConfirmModal}
        onCancel={() => setShowDeleteConfirmModal(false)}
        icon={<IconAlertCircle stroke="red" background="red" size="xlarge" />}
        customFooter={[
          <Space key='1'>
            <Button onClick={() => setShowDeleteConfirmModal(false)}>Cancel</Button>
            <Button
              danger
              icon={<IconTrash />}
              disabled={isDeletingAccount}
              loading={isDeletingAccount}
              onClick={() => deleteAccount()}
            >
              Delete
            </Button>
          </Space>,
        ]}
      >
        <div>
          <Typography.Text>Are you sure you want to delete your account?</Typography.Text>
        </div>
        <div>
          <Typography.Text>Note: This will delete all you information and this operation is not reversible.</Typography.Text>
        </div>
      </Modal>
    </div>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
  cookieOptions: {
    name: process.env.NEXT_PUBLIC_COOKIE_NAME,
  }
});
