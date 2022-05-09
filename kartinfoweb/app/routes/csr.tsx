import { json, ActionFunction, redirect } from "@remix-run/node";
import {
  useActionData,
  Form,
  useFetcher,
  useTransition,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { API_KEY } from "../../key";

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

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const name = body.get("visitorsName");

  const res = await fetch(API_URL + encodeURI("붕붕프로"), {
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
      mode: "cors",
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
  const [data, setData] = useState<Matches>();
  useEffect(() => {
    async function fetchData() {
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
      setData(await matchRes.json());
    }
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {data}
    </div>
  );
}
