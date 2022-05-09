import { json, ActionFunction, redirect } from "@remix-run/node";
import {
  useActionData,
  Form,
  useFetcher,
  useTransition,
} from "@remix-run/react";
import { useEffect } from "react";

export interface MatchDetail {
  accountNo: string;
  matchId: string;
  matchType: string;
  teamId: string;
  character: string;
  startTime: string;
  endTime: string;
  playTime: number;
}

interface MatchInfo {
  matchType: string;
  matches: MatchDetail[];
}

interface Matches {
  matches: MatchInfo[];
}

type KartData = {
  accessId: string;
  name: string;
  level: number;
};

const API_URL = "https://api.nexon.co.kr/kart/v1.0/users/nickname/";
const MATCH_INFO_URL = "https://api.nexon.co.kr/kart/v1.0/users/";
const MATCH_MEMBER_INFO_URL = "https://api.nexon.co.kr/kart/v1.0/matches/";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTk2MzE5NjU4NyIsImF1dGhfaWQiOiI0IiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTM5MyIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTYxNzExNDY3NSwiZXhwIjoxNjgwMTg2Njc1LCJpYXQiOjE2MTcxMTQ2NzV9.SgF91CPqfCnw5KI4KD-3Ve-7UKjhUSp_xqn7R422OBM";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const name = body.get("visitorsName");

  const res = await fetch(API_URL + name, {
    method: "GET",
    headers: {
      Authorization: API_KEY,
    },
  });
  const response: Promise<KartData> = res.json();
  const { accessId } = await response;

  const matchRes = await fetch(
    MATCH_INFO_URL + accessId + "/matches?limit=300",
    {
      method: "GET",
      headers: {
        Authorization: API_KEY,
      },
    }
  );
  console.log(matchRes);

  return json(await matchRes.json());
  // return redirect(`/${name}`);
};

export default function Index() {
  const data = useActionData<Matches>();
  const transition = useTransition();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Form replace method="post">
        <p>
          <label>
            What is your name?
            <input type="text" name="name" />
          </label>

          <button type="submit">
            {transition.state === "submitting" ? "Saving..." : "제출"}
          </button>
        </p>
      </Form>
    </div>
  );
}
