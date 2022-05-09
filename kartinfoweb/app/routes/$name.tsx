import { json, LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { useEffect } from "react";

const API_URL = "https://api.nexon.co.kr/kart/v1.0/users/nickname/";
const MATCH_INFO_URL = "https://api.nexon.co.kr/kart/v1.0/users/";
const MATCH_MEMBER_INFO_URL = "https://api.nexon.co.kr/kart/v1.0/matches/";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTk2MzE5NjU4NyIsImF1dGhfaWQiOiI0IiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTM5MyIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTYxNzExNDY3NSwiZXhwIjoxNjgwMTg2Njc1LCJpYXQiOjE2MTcxMTQ2NzV9.SgF91CPqfCnw5KI4KD-3Ve-7UKjhUSp_xqn7R422OBM";

type KartData = {
  accessId: string;
  name: string;
  level: number;
};

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

export const loader: LoaderFunction = async ({ params }) => {
  // const reqUrl = API_URL + encodeURI(params.name);

  const res = await fetch(API_URL + params.name, {
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

  return json(await matchRes.json());
};

export default function NameRoute() {
  const data = useLoaderData() as Matches;
  const { matches } = data;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {/* {data.data ? <p>{data}</p> : <p>Loading...</p>} */}
      <p>
        {matches.map((val, idx) => (
          <p key={idx}>
            {val.matches.map((val, idx) => (
              <span key={idx}>
                {idx} {val.matchId}
              </span>
            ))}
          </p>
        ))}
      </p>
    </div>
  );
}
