import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Joke } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = { joke: Joke };

// JokeRoute 쪽에서 useLoaderData를 통해 여기서 보낸 데이터를 읽을 수 있다.
// 마치... next.js의 getServerSideProps, getStaticProps 에서 보낸 데이터를 보내듯이?
export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) throw new Error("Joke not found");
  const data: LoaderData = { joke };
  return json(data);
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name} Permalink</Link>
    </div>
  );
}
