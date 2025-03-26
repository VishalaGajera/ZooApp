import React, { useState } from "react";
import { TbHexagonFilled, TbStarFilled, TbStar } from "react-icons/tb";
import { LuDollarSign, LuUsers } from "react-icons/lu";
import { HiDotsHorizontal } from "react-icons/hi";
import { VscFeedback } from "react-icons/vsc";
import { Link } from "react-router-dom";
import LineChart from "./LineChart";
import { useQuery } from "@tanstack/react-query";

function Dashboard() {
  const [isRecentOrderOpen, setIsRecentOrderOpen] = useState(false);
  const url = import.meta.env.VITE_API_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const { data } = useQuery({
    queryKey: ["fetchDashboardData"],
    queryFn: async () => {
      const userDataPromise = fetch(`${url}/user/get`).then((res) =>
        res.json()
      );
      const feedbackDataPromise = fetch(`${url}/feedback/get`).then((res) =>
        res.json()
      );
      const adoptionDataPromise = fetch(`${url}/adoption/get`).then((res) =>
        res.json()
      );
      const [userData, feedbackData, adoptionData] = await Promise.all([
        userDataPromise,
        feedbackDataPromise,
        adoptionDataPromise,
      ]);
      return { userData, feedbackData, adoptionData };
    },
  });

  const totalAdoptionCost = data?.adoptionData?.data?.reduce(
    (total, adoption) => total + adoption.cost,
    0
  );

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 pt-5 px-5 xl:grid-cols-4">
        <div className="flex bg-white justify-between rounded-xl shadow-lg items-center px-3 py-5">
          <div className="flex gap-3 items-center">
            <div className="flex h-12 justify-center text-success w-12 items-center relative">
              <TbHexagonFilled className="h-full w-full" />
              <span className="flex justify-center text-white absolute items-center">
                <LuUsers className="h-5 w-5" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-secondary font-semibold">Users</span>
            </div>
          </div>
          <span className="text-xl font-bold">
            {data?.userData?.data?.length || 0}
          </span>
        </div>
        <div className="flex bg-white justify-between rounded-xl shadow-lg items-center px-3 py-5">
          <div className="flex gap-3 items-center">
            <div className="flex h-12 justify-center text-primary w-12 items-center relative">
              <TbHexagonFilled className="h-full w-full" />
              <span className="flex justify-center text-white absolute items-center">
                <LuDollarSign className="h-5 w-5" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-secondary font-semibold">Adoptions</span>
              <span className="text-xl font-bold">
                {currency}
                {totalAdoptionCost}
              </span>
            </div>
          </div>
          <div className="text-2xl font-semibold">
            {data?.adoptionData?.data?.length || 0}
          </div>
        </div>
        <div className="flex bg-white justify-between rounded-xl shadow-lg items-center px-3 py-5">
          <div className="flex gap-3 items-center">
            <div className="flex h-12 justify-center text-warning w-12 items-center relative">
              <TbHexagonFilled className="h-full w-full" />
              <span className="flex justify-center text-white absolute items-center">
                <VscFeedback className="h-5 w-5" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-secondary font-semibold">Feedbacks</span>
            </div>
          </div>
          <span className="text-xl font-bold">
            {data?.feedbackData?.data?.length || 0}
          </span>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-5 px-5 xl:grid-cols-2">
        <div className="flex flex-col bg-white justify-center p-5 rounded-xl shadow-lg gap-5 items-center">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-xl font-bold">Recent Order</h1>
          </div>
          <div className="h-full w-full">
            <LineChart data={data?.adoptionData?.data} />
          </div>
        </div>
        <div className="flex flex-col bg-white justify-start p-5 rounded-xl shadow-lg gap-5 items-center overflow-y-auto">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-xl font-bold">Users</h1>
            <div className="relative">
              <Link
                to={"/user"}
                className="flex text-secondary_2 text-sm gap-2 hover:text-blue hover:underline items-center smoothly-transaction"
              >
                {data?.userData?.data.length > 0 && "View all"}
              </Link>
            </div>
          </div>
          <div className="w-full overflow-x-auto scrollbar-hide max-h-96 ">
            <ul className="flex flex-col w-full gap-3 min-w-[520px]">
              {data?.userData?.data.length > 0
                ? data?.userData?.data?.slice(0, 5).map((user, index) => (
                    <li
                      className="flex justify-between w-full gap-5 items-center"
                      key={index}
                    >
                      <div className="bg-surface h-14 p-2 rounded-lg w-14">
                        <img
                          src="https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png?v=2025022723"
                          alt=""
                          className="h-full w-full"
                        />
                      </div>
                      <div className="flex justify-between w-full gap-5 items-center">
                        <div>
                          <h1 className="font-semibold">
                            {user.first_name} {user.last_name}
                          </h1>
                        </div>
                        <div>
                          <span className="text-secondary text-sm">
                            {user.mobile}
                          </span>
                        </div>
                        <div>
                          <h1 className="font-semibold">{user.email_id}</h1>
                        </div>
                      </div>
                    </li>
                  ))
                : "No user data available"}
            </ul>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-5 pb-5 px-5 xl:grid-cols-2">
        <div className="flex flex-col bg-white justify-start p-5 rounded-xl shadow-lg gap-5 items-center">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-xl font-bold">Adoptions</h1>
            {data?.adoptionData?.data?.length > 0 && (
              <div className="relative">
                <Link
                  to={"/adoption"}
                  className="flex text-secondary_2 text-sm gap-2 hover:text-blue hover:underline items-center smoothly-transaction"
                >
                  {data?.adoptionData?.data?.length > 0 && "View all"}
                </Link>
              </div>
            )}
          </div>
          <div className="w-full overflow-x-auto scrollbar-hide">
            {data?.adoptionData?.data?.length > 0 ? (
              <table className="table-auto w-full min-w-[520px]">
                <thead>
                  <tr className="text-left">
                    <th className="py-2">Donar name</th>
                    <th className="py-2">animal name</th>
                    <th className="py-2">date</th>
                    <th className="py-2">period</th>
                    <th className="py-2">frequency</th>
                    <th className="py-2">cost</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.adoptionData?.data
                    ?.slice(0, 6)
                    .map((adoption, index) => (
                      <tr key={index}>
                        <td className="py-2">
                          {adoption?.userId?.first_name}{" "}
                          {adoption?.userId?.last_name}
                        </td>
                        <td className="py-2">{adoption?.animal_name}</td>
                        <td className="py-2">
                          {new Date(adoption?.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2">{adoption?.period}</td>
                        <td className="py-2">{adoption?.frequency}</td>
                        <td className="py-2">
                          {currency}
                          {adoption?.cost}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              "No adoption data available"
            )}
          </div>
        </div>
        <div className="flex flex-col bg-white justify-start p-5 rounded-xl shadow-lg gap-5 items-center">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-xl font-bold">Feedbacks</h1>
            <div className="relative">
              <Link
                to={"/feedback"}
                className="flex text-secondary_2 text-sm gap-2 hover:text-blue hover:underline items-center smoothly-transaction"
              >
                {data?.feedbackData?.data?.length > 0 && "View all"}
              </Link>
            </div>
          </div>
          <div className="w-full overflow-y-auto scrollbar-hide">
            <div className="flex flex-col gap-1 max-h-[280px]">
              {data?.feedbackData?.data?.length > 0
                ? data?.feedbackData?.data
                    ?.slice(0, 5)
                    .map((feedback, index) => (
                      <div className="flex gap-3 items-center py-2" key={index}>
                        <div className="h-12 rounded-lg w-12 min-w-12 overflow-hidden">
                          <img
                            src={`https://modavenextjs.vercel.app/images/products/womens/women-${
                              index + 1
                            }.jpg`}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h1 className="flex text-sm font-bold gap-2 items-center">
                            {feedback.userId.first_name}{" "}
                            {feedback.userId.last_name}
                            <div className="flex text-primary text-sm items-center pb-1 pt-0.5">
                              {[...Array(5)].map((_, index) =>
                                index < feedback.rating ? (
                                  <TbStarFilled key={index} />
                                ) : (
                                  <TbStar key={index} />
                                )
                              )}
                            </div>
                          </h1>
                          <span className="text-secondary text-xs line-clamp-2">
                            {feedback.comment}
                          </span>
                        </div>
                      </div>
                    ))
                : "No feedback data available"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
