import { Form, useTransition } from "@remix-run/react";

export const action = async () => {
  await new Promise((res) => setTimeout(res, 1000));

  return null;
};

export default function Index() {
  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  return (
    <Form method="post">
      <input type={"text"} name={"test"} />
      <button disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Post"}
      </button>
    </Form>
  );
}
